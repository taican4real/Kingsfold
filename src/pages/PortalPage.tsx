import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, LogIn, AlertCircle, ArrowRight, User, Database } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SEO from '../components/SEO';

export default function PortalPage() {
  const { user, role, kiaCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'admin' | 'hod' | 'teacher'>('teacher');
  const [formData, setFormData] = useState({
    fullName: '',
    department: 'Science',
    phone: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);

    try {
      if (isSignUpMode) {
        // Pre-set the forced role and dept so AuthProvider sees them
        localStorage.setItem('dev_force_role', selectedRole);
        localStorage.setItem('dev_force_dept', formData.department);
        localStorage.setItem('dev_reg_full_name', formData.fullName);
        localStorage.setItem('dev_reg_phone', formData.phone);
      } else {
        localStorage.removeItem('dev_force_role');
        localStorage.removeItem('dev_force_dept');
        localStorage.removeItem('dev_reg_full_name');
        localStorage.removeItem('dev_reg_phone');
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      
      // If we reach here, signIn was successful.
      // AuthProvider will handle the Firestore write based on localStorage.
      // We'll give it a moment and then check for success.
      setShowSuccess(true);
    } catch (err: any) {
      console.error("Auth error details:", err);
      if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
        setError("Authentication popup was closed or cancelled by the browser sandbox. Opening the app in a new tab is required to allow secure Google authentication.");
      } else if (err.code === 'auth/popup-blocked') {
        setError("Authentication popup was blocked by your browser. Please allow popups or open the app in a new tab to continue.");
      } else if (err.code === 'auth/network-request-failed') {
        setError("Network error. Please check your connection and try again, or try opening the app in a new tab.");
      } else if (err.code === 'permission-denied') {
        setError("Database access denied. Please contact IT support.");
      } else if (err.message && err.message.includes('Pending promise was never set')) {
        setError("Authentication was interrupted by iframing restrictions. Please try again in a new tab.");
      } else {
        setError(`Authentication failed: ${err.message || 'Unknown error'}. Try opening the app in a new tab.`);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (showSuccess && user) {
    return (
      <div className="min-h-screen bg-cream/20 pt-32 pb-20 px-4">
        <div className="max-w-md mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 md:p-12 shadow-2xl border border-wine/5 text-center"
          >
            {!kiaCode && role !== 'admin' ? (
              <div className="py-20 flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-wine/10 border-t-wine rounded-full animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Finalizing Identity...</p>
                <p className="text-[8px] text-gray-300 uppercase tracking-widest mt-4">Setting up your secure credentials</p>
                <p className="text-[8px] text-gray-300 uppercase tracking-widest">This may take a moment</p>
                
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-8 text-[9px] uppercase tracking-widest text-wine/40 hover:text-wine transition-colors underline"
                >
                  Taking too long? Click here to refresh
                </button>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ShieldCheck className="text-green-500" size={40} />
                </div>
                <h2 className="text-2xl font-serif font-bold text-wine uppercase tracking-tight mb-2">Registration Successful</h2>
                <p className="text-gray-500 text-xs uppercase tracking-widest mb-8">Welcome to Kingsfold Academy</p>
                
                {role !== 'admin' && (
                  <>
                    <div className="bg-gray-50 border border-dashed border-wine/20 p-6 mb-8 rounded-xl">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Your Unique Staff ID</p>
                      <p className="text-3xl font-mono font-bold text-wine tracking-tighter">{kiaCode}</p>
                    </div>

                    <p className="text-[10px] text-gray-400 uppercase tracking-widest leading-relaxed mb-10">
                      Please keep this code safe. You will need it for official verification and portal access.
                    </p>
                  </>
                )}

                <button 
                  onClick={() => navigate(from, { replace: true })}
                  className="w-full bg-wine text-white py-4 uppercase tracking-widest font-bold text-[10px] hover:bg-red transition-all flex items-center justify-center gap-2"
                >
                  Continue to Portal <ArrowRight size={14} />
                </button>
              </>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/20 pt-32 pb-20 px-4">
      <SEO 
        title="Portal Login | Kingsfold International Academy" 
        description="Access the Kingsfold International Academy staff and student portal."
      />

      <div className="max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 md:p-12 shadow-2xl border border-wine/5 relative overflow-hidden"
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-wine/5 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-red/5 rounded-full -ml-12 -mb-12" />

          <div className="relative z-10 text-center mb-10">
            <div className="w-16 h-16 bg-wine/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-wine" size={32} />
            </div>
            <h2 className="text-2xl font-serif font-bold text-wine uppercase tracking-tight">
              {isSignUpMode ? "Portal Sign Up" : "Portal Sign In"}
            </h2>
            <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Staff & Authorized Personnel only</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 p-4 bg-red/10 border-l-4 border-red text-red text-xs flex gap-3 items-start"
            >
              <AlertCircle size={16} className="shrink-0 flex-none mt-0.5" />
              <div className="flex-1">
                <p className="font-bold uppercase tracking-wider text-[10px] mb-1">Registration Error</p>
                <p className="leading-relaxed">{error}</p>
                {(error.toLowerCase().includes('popup') || error.toLowerCase().includes('closed') || error.toLowerCase().includes('blocked') || error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('interrupted') || error.toLowerCase().includes('new tab')) && (
                  <button 
                    type="button"
                    onClick={() => window.open(window.location.href, '_blank')}
                    className="mt-3 bg-wine text-white py-1.5 px-4 rounded text-[9px] font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2 hover:bg-wine-dark transition-all shadow-md active:scale-[0.98] w-fit"
                  >
                    Open in New Tab
                  </button>
                )}
              </div>
            </motion.div>
          )}

          <form onSubmit={handleRegistration} className="space-y-6">
            {isSignUpMode && (
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="text" 
                    name="fullName"
                    placeholder="FULL NAME" 
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                  />
                </div>

                {selectedRole !== 'admin' && (
                  <div className="relative">
                    <Database className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                    <select 
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                      className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all appearance-none"
                    >
                      <option value="Science">Science</option>
                      <option value="Language">Language</option>
                      <option value="Humanities">Humanities</option>
                      <option value="Commercial">Commercial</option>
                    </select>
                  </div>
                )}

                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <select 
                    name="role"
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as any)}
                    className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all appearance-none"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="relative">
                  <LogIn className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="TELEPHONE NUMBER" 
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-white border border-gray-100 py-4 pl-12 pr-4 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-wine/50 focus:ring-1 focus:ring-wine/20 transition-all"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-wine text-white py-4 px-6 uppercase tracking-widest font-bold text-[10px] flex items-center justify-center gap-4 hover:bg-red transition-all shadow-sm disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Identity...
                </>
              ) : (
                <>
                  <ShieldCheck size={16} />
                  {isSignUpMode ? "Register with Google & Secure Portal" : "Sign In with Google"}
                </>
              )}
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-[8px] uppercase font-bold text-gray-300 tracking-[0.2em]">Social Verification</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>
            
            <p className="text-[9px] text-gray-400 text-center uppercase tracking-widest italic">
              Note: Registration will be completed via Google Secure Sign-In
            </p>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[10px] text-gray-400 leading-relaxed uppercase tracking-wider">
              By accessing this portal, you agree to comply with Kingsfold International Academy's digital security policies.
            </p>
          </div>
        </motion.div>

        <div className="mt-8 text-center flex flex-col gap-4">
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">
            {isSignUpMode ? "Already have access?" : "Need an account?"} {' '}
            <button 
              onClick={() => setIsSignUpMode(!isSignUpMode)} 
              className="text-wine font-bold hover:underline"
            >
              {isSignUpMode ? "Sign In" : "Sign Up"}
            </button>
          </p>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest">
            Issues logging in? <button className="text-wine font-bold hover:underline">Contact IT Department</button>
          </p>
        </div>
      </div>
    </div>
  );
}
