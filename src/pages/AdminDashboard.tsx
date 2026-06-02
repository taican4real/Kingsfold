import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ShieldCheck, Users, Database, Trash2, AlertTriangle, X, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';
import { handleFirestoreError, OperationType } from '../components/AuthProvider';
import SEO from '../components/SEO';

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState<{ id: string; fullName?: string; email: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, 'users')).catch(err => {
          handleFirestoreError(err, OperationType.LIST, 'users');
          return { docs: [] } as any;
        });
        const usersList = usersSnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
      } catch (err) {
        console.error("Error fetching admin data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      await updateDoc(doc(db, 'users', userId), { role: newRole }).catch(err => {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userId}`);
        throw err;
      });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showNotification('success', `Role successfully updated to ${newRole}.`);
    } catch (err) {
      console.error(err);
      showNotification('error', "Failed to update user role.");
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDoc(doc(db, 'users', userToDelete.id)).catch(err => {
        handleFirestoreError(err, OperationType.DELETE, `users/${userToDelete.id}`);
        throw err;
      });
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      showNotification('success', "Staff account successfully deleted.");
      setUserToDelete(null);
    } catch (err) {
      console.error(err);
      showNotification('error', "Failed to delete staff user. Please verify database rules or network.");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-20 px-4 md:px-8">
      <SEO 
        title="Admin Control Center" 
        description="Centralized Administrative Control Dashboard for Kingsfold International Academy."
        noIndex={true}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-red" size={24} />
              <span className="text-red text-[10px] font-bold uppercase tracking-widest">Administrative Control</span>
            </div>
            <h1 className="font-serif text-4xl text-wine italic">Central Command</h1>
          </div>
          <Link to="/" className="flex items-center gap-2 text-wine text-xs font-bold uppercase tracking-widest hover:text-red transition-colors">
            <Home size={16} /> Return Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar / Stats */}
          <div className="lg:col-span-1 space-y-4">
               <div className="bg-white p-6 border border-wine/5 shadow-sm">
                <Users className="text-wine mb-4" size={20} />
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Total Registered</p>
                <p className="text-2xl font-serif text-wine">{users.length}</p>
             </div>

             <div className="bg-wine p-6 shadow-xl text-white">
                <Database className="text-red mb-4" size={20} />
                <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Status</p>
                <p className="text-sm font-bold uppercase tracking-widest">Systems Online</p>
             </div>

             <Link to="/admin/cms" className="block w-full bg-white p-6 border border-wine/5 shadow-sm hover:border-wine/30 transition-all text-left">
               <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Content Mgmt</p>
               <h3 className="font-serif text-lg text-wine">Edit Website</h3>
             </Link>
          </div>

          {/* User Management */}
          <div className="lg:col-span-3">
             <div className="bg-white border border-wine/5 shadow-xl overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-serif text-xl text-wine">User Management</h3>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[9px] uppercase tracking-widest text-gray-400">Live Sync</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-gray-500 border-b border-gray-100">
                        <th className="p-6 text-left font-bold">STAFF ID / KIA CODE</th>
                        <th className="p-6 text-left font-bold">Full Name</th>
                        <th className="p-6 text-left font-bold">Email</th>
                        <th className="p-6 text-left font-bold">Department</th>
                        <th className="p-6 text-left font-bold">Phone</th>
                        <th className="p-6 text-left font-bold">Role</th>
                        <th className="p-6 text-left font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="p-20 text-center text-gray-400 animate-pulse uppercase tracking-widest text-[10px]">
                            Fetching Database...
                          </td>
                        </tr>
                      ) : users.map(u => (
                        <tr key={u.id} className="border-b border-gray-50 hover:bg-cream/5 transition-colors">
                           <td className="p-6 font-mono text-[10px] text-wine font-bold">{u.kiaCode || 'N/A'}</td>
                           <td className="p-6 font-medium text-gray-800">{u.fullName || 'N/A'}</td>
                           <td className="p-6 text-gray-500">{u.email}</td>
                           <td className="p-6">
                            <span className="px-2 py-1 bg-gray-100 text-[10px] uppercase font-bold text-gray-600 rounded">
                              {u.department || 'N/A'}
                            </span>
                           </td>
                           <td className="p-6 text-gray-500 text-[10px]">{u.phone || 'N/A'}</td>
                          <td className="p-6">
                            <span className={cn(
                              "px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-full",
                              u.role === 'admin' ? "bg-red text-white" : 
                              u.role === 'staff' ? "bg-wine text-white" : 
                              u.role === 'hod' ? "bg-red/80 text-white" :
                              u.role === 'teacher' ? "bg-wine/80 text-white" : "bg-gray-100 text-gray-500"
                            )}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-6">
                            <div className="flex items-center gap-2">
                              <select 
                                value={u.role}
                                onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                className="bg-cream-light/50 border-none text-[10px] font-bold uppercase tracking-widest p-2 outline-none focus:ring-1 focus:ring-wine"
                              >
                                <option value="student">Student</option>
                                <option value="parent">Parent</option>
                                <option value="teacher">Teacher</option>
                                <option value="hod">HOD</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button
                                onClick={() => setUserToDelete({ id: u.id, fullName: u.fullName, email: u.email })}
                                className="p-2 text-gray-400 hover:text-red transition-colors rounded-sm hover:bg-red/10"
                                title="Delete User"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={cn(
              "fixed bottom-8 right-8 z-50 flex items-center gap-3 px-4 py-3 shadow-lg border text-xs font-mono tracking-wider uppercase font-semibold",
              notification.type === 'success' 
                ? "bg-stone-900 border-green-500/30 text-green-400" 
                : "bg-stone-900 border-red/30 text-rose-400"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", notification.type === 'success' ? "bg-green-500" : "bg-red")} />
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white border border-wine/10 max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <div className="flex items-center gap-2 text-red">
                  <AlertTriangle size={18} />
                  <h4 className="font-serif text-lg font-bold text-wine">Confirm Account Deletion</h4>
                </div>
                <button 
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-3">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Are you sure you want to delete this staff account? This action is permanent and cannot be undone.
                </p>
                
                <div className="bg-gray-50 border border-gray-100 p-3 rounded space-y-1">
                  <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400">Staff Profile</p>
                  <p className="text-sm font-semibold text-gray-800">{userToDelete.fullName || 'Unnamed Account'}</p>
                  <p className="text-xs font-mono text-wine">{userToDelete.email}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-600 hover:bg-gray-100 hover:text-black transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red hover:bg-wine text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? (
                    <>
                      <Loader size={14} className="animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={14} />
                      Delete Permanently
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
