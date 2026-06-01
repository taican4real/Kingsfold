import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocFromServer, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errStr = error instanceof Error ? error.message : String(error);
  const errStrLower = errStr.toLowerCase();

  const isOfflineError = errStrLower.includes('offline') || 
                         errStrLower.includes('could not reach') || 
                         errStrLower.includes('network') ||
                         errStrLower.includes('timeout') ||
                         errStrLower.includes('failed to get document because the client is offline') ||
                         errStrLower.includes('failed-precondition') ||
                         errStrLower.includes('unavailable');

  const isPermissionError = errStrLower.includes('permission') || 
                            errStrLower.includes('denied') || 
                            errStrLower.includes('insufficient');

  const errInfo: FirestoreErrorInfo = {
    error: errStr,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };

  if (isOfflineError) {
    // Graceful offline warning/info without throwing or logging as fatal error
    console.info(`[Offline Info] Firestore operating in offline fallback mode for ${operationType} on ${path || 'unknown'}`);
    return;
  }

  // Real error, log with error severity
  console.error('Firestore Error: ', JSON.stringify(errInfo));

  if (isPermissionError) {
    throw new Error(JSON.stringify(errInfo));
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: string | null;
  isAdmin: boolean;
  isStaff: boolean;
  department: string | null;
  kiaCode: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  role: null,
  isAdmin: false,
  isStaff: false,
  department: null,
  kiaCode: null,
});

export const useAuth = () => useContext(AuthContext);

// Helper to generate KIA-XXX-XXX code
const generateKIACode = () => {
  const digits = '0123456789';
  const part1 = Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * 10)]).join('');
  const part2 = Array.from({ length: 3 }, () => digits[Math.floor(Math.random() * 10)]).join('');
  return `KIA-${part1}-${part2}`;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [department, setDepartment] = useState<string | null>(null);
  const [kiaCode, setKIACode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userPath = `users/${user.uid}`;
          const userDoc = await getDoc(doc(db, 'users', user.uid)).catch(err => {
            handleFirestoreError(err, OperationType.GET, userPath);
            return null; // unreachable due to throw
          });

          if (userDoc && userDoc.exists()) {
            const data = userDoc.data();
            
            // Clean up dev storage for existing users so it doesn't cause state mismatch
            localStorage.removeItem('dev_force_role');
            localStorage.removeItem('dev_force_dept');
            localStorage.removeItem('dev_reg_full_name');
            localStorage.removeItem('dev_reg_phone');
            localStorage.removeItem('dev_reg_email');
            
            setKIACode(data.kiaCode || null);
            setRole(data.role || (user.email === 'taican4real@gmail.com' ? 'admin' : 'student'));
            setDepartment(data.department || null);
          } else {
            // New user registration
            const forcedRole = localStorage.getItem('dev_force_role');
            const forcedDept = localStorage.getItem('dev_force_dept');
            const forcedFullName = localStorage.getItem('dev_reg_full_name');
            const forcedPhone = localStorage.getItem('dev_reg_phone');
            let defaultRole = forcedRole || (user.email === 'taican4real@gmail.com' ? 'admin' : 'student');

            // Enforce Admin Limit - ONLY if user selected 'admin' in registration
            if (forcedRole === 'admin') {
              try {
                // Check if admin limit reached with a timeout fallback
                const adminQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
                
                // Racing the query against a 5 second timeout to prevent hangs
                const queryPromise = getDocs(adminQuery);
                const timeoutPromise = new Promise<null>((_, reject) => 
                  setTimeout(() => reject(new Error('Admin check timeout')), 5000)
                );

                const adminSnapshot = await Promise.race([queryPromise, timeoutPromise]) as any;
                
                if (adminSnapshot && adminSnapshot.size >= 2 && user.email !== 'taican4real@gmail.com') {
                  console.warn("Admin limit reached, downgrading to teacher");
                  defaultRole = 'teacher';
                }
              } catch (e: any) {
                console.error("Error or timeout checking admin limit:", e.message);
                // Fallback safe: if we can't verify and it's not the owner, don't allow admin
                if (user.email !== 'taican4real@gmail.com') {
                  defaultRole = 'teacher';
                }
              }
            } else {
              // Not admin, just use the forced role or default
              defaultRole = forcedRole || (user.email === 'taican4real@gmail.com' ? 'admin' : 'student');
            }

            const newKIACode = defaultRole === 'admin' ? null : generateKIACode();
            
            const userData: any = {
              email: user.email,
              role: defaultRole,
              createdAt: new Date().toISOString(),
            };
            
            if (newKIACode) userData.kiaCode = newKIACode;
            
            if (forcedDept) userData.department = forcedDept;
            if (forcedFullName) userData.fullName = forcedFullName;
            if (forcedPhone) userData.phone = forcedPhone;
            
            // Set state optimistically so UI can progress
            setRole(defaultRole);
            setDepartment(forcedDept || null);
            setKIACode(newKIACode);

            console.log("Saving user directory entry for:", user.uid);
            
            await setDoc(doc(db, 'users', user.uid), userData).catch(err => {
              console.error("Failed to create user document synchronously:", err);
              handleFirestoreError(err, OperationType.WRITE, userPath);
            });

            console.log("User directory entry saved successfully.");
            
            // Clear dev storage after use
            localStorage.removeItem('dev_force_role');
            localStorage.removeItem('dev_force_dept');
            localStorage.removeItem('dev_reg_full_name');
            localStorage.removeItem('dev_reg_phone');
            localStorage.removeItem('dev_reg_email');
          }
        } catch (error) {
          console.error("Auth initialization error:", error);
          setRole(null);
        }
      } else {
        setRole(null);
        setKIACode(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    loading,
    role,
    isAdmin: role === 'admin' || user?.email === 'taican4real@gmail.com',
    isStaff: ['admin', 'staff', 'hod', 'teacher'].includes(role || '') || user?.email === 'taican4real@gmail.com',
    department,
    kiaCode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
