import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, AlertCircle, ArrowRight, Lock, Mail, Key } from 'lucide-react';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import SEO from '../components/SEO';

export default function AdminLoginPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const from = location.state?.from?.pathname || "/admin";

  // If already logged in and is admin, redirect to admin immediately
  useEffect(() => {
    if (!loading && user && isAdmin) {
      navigate(from, { replace: true });
    }
  }, [user, isAdmin, loading, navigate, from]);

  const handleGoogleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    setError(null);
    setSuccess(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
      // Let the useEffect handle redirection or checking
    } catch (err: any) {
      console.error("Auth error details:", err);
      handleAuthError(err);
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoggingIn) return;
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
    
    setIsLoggingIn(true);
    setError(null);
    setSuccess(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      console.error("Email auth error:", err);
      handleAuthError(err);
      setIsLoggingIn(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address to reset password.");
      return;
    }

    setIsLoggingIn(true);
    setError(null);
    setSuccess(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess("Password reset email sent! Check your inbox.");
      setIsForgotPassword(false);
      setPassword('');
    } catch (err: any) {
      console.error("Password reset error:", err);
      handleAuthError(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAuthError = (err: any) => {
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
    } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
      setError("Invalid email or password.");
    } else if (err.code === 'auth/operation-not-allowed') {
      setError("Email/Password sign-in is not enabled in your Firebase project. To enable it:\n\n1. Open the Firebase Console Auth Settings.\n2. In the 'Sign-in method' tab under 'Sign-in providers', click 'Add new provider' (or the edit button if already listed).\n3. Choose 'Email/Password'.\n4. Enable 'Email/Password' (leave passwordless unchecked) and click 'Save'.");
    } else {
      setError(`Authentication failed: ${err.message || 'Unknown error'}. Try opening the app in a new tab.`);
    }
  };

  // Evaluate if they logged in but aren't admin
  useEffect(() => {
    if (!loading && user && !isAdmin && isLoggingIn) {
      // They signed in but are not admin, so sign them out
      signOut(auth).then(() => {
        setError("Access Denied: Administrator privileges required.");
        setIsLoggingIn(false);
      });
    }
  }, [user, isAdmin, loading, isLoggingIn]);

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center pt-20 pb-20 px-4">
      <SEO 
        title="Admin Login | CMS" 
        description="Systems Administrator Login"
      />

      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black p-8 md:p-12 shadow-2xl border border-white/10 relative overflow-hidden"
        >
          <div className="relative z-10 text-center mb-10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
              <Lock className="text-white" size={28} />
            </div>
            <h2 className="text-2xl font-mono font-bold text-white uppercase tracking-tight">
              CMS Admin
            </h2>
            <p className="text-gray-400 text-[10px] uppercase tracking-widest mt-2">Restricted Access</p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                key="error"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 bg-red-500/10 border-l-4 border-red-500 text-red-500 text-xs flex gap-3 items-start"
              >
                <AlertCircle size={16} className="shrink-0 flex-none mt-0.5" />
                <div className="flex-1">
                  <p className="font-bold uppercase tracking-wider text-[10px] mb-1">Error</p>
                  <p className="leading-relaxed whitespace-pre-line">{error}</p>
                  {error.toLowerCase().includes('firebase project') && (
                    <a 
                      href="https://console.firebase.google.com/project/gen-lang-client-0026405485/authentication/providers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 px-3 py-1.5 bg-red-500 hover:bg-white text-white hover:text-red-500 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-200 border border-transparent hover:border-red-500 rounded-sm inline-flex items-center gap-1.5"
                    >
                      Configure Firebase Auth Settings
                    </a>
                  )}
                  {(error.toLowerCase().includes('popup') || error.toLowerCase().includes('closed') || error.toLowerCase().includes('blocked') || error.toLowerCase().includes('cancelled') || error.toLowerCase().includes('interrupted') || error.toLowerCase().includes('new tab')) && !error.toLowerCase().includes('firebase project') && (
                    <button 
                      type="button"
                      onClick={() => window.open(window.location.href, '_blank')}
                      className="mt-3 px-3 py-1.5 bg-red-500 hover:bg-white text-white hover:text-red-500 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors duration-200 border border-transparent hover:border-red-500 rounded-sm inline-flex items-center gap-1.5"
                    >
                      Open App in New Tab
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {success && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-8 p-4 bg-green-500/10 border-l-4 border-green-500 text-green-500 text-xs flex gap-3 items-start"
              >
                <ShieldAlert size={16} className="shrink-0" />
                <div>
                  <p className="font-bold">Success</p>
                  <p>{success}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {!isForgotPassword ? (
              <motion.div 
                key="login-form" 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 p-3 text-sm focus:border-white focus:outline-none transition-colors"
                        placeholder="admin@kingsfold.edu"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Password</label>
                      <button 
                        type="button" 
                        onClick={() => { setIsForgotPassword(true); setError(null); setSuccess(null); }}
                        className="text-[10px] text-gray-400 hover:text-white uppercase tracking-widest transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 p-3 text-sm focus:border-white focus:outline-none transition-colors"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoggingIn || loading}
                    className="w-full bg-white text-black py-4 px-6 uppercase tracking-widest font-bold text-[10px] flex items-center justify-center gap-4 hover:bg-gray-200 transition-all shadow-sm disabled:opacity-50 mt-2"
                  >
                    {isLoggingIn || loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={16} />
                        Sign In with Email
                      </>
                    )}
                  </button>
                </form>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                    <span className="bg-black px-2 text-gray-500">Or</span>
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoggingIn || loading}
                  className="w-full bg-white/5 text-white py-4 px-6 uppercase tracking-widest font-bold text-[10px] flex items-center justify-center gap-4 hover:bg-white/10 transition-all border border-white/10 disabled:opacity-50"
                  >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign In with Google
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="forgot-password" 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-gray-400 text-sm mb-4">
                    Enter your email address and we'll send you a link to reset your administrator password.
                  </p>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 text-white pl-10 p-3 text-sm focus:border-white focus:outline-none transition-colors"
                        placeholder="admin@kingsfold.edu"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit"
                    disabled={isLoggingIn || loading}
                    className="w-full bg-white text-black py-4 px-6 uppercase tracking-widest font-bold text-[10px] flex items-center justify-center gap-4 hover:bg-gray-200 transition-all shadow-sm disabled:opacity-50"
                  >
                    {isLoggingIn || loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <ArrowRight size={16} />
                        Send Reset Link
                      </>
                    )}
                  </button>
                  
                  <button 
                    type="button" 
                    onClick={() => { setIsForgotPassword(false); setError(null); setSuccess(null); }}
                    className="w-full bg-transparent text-gray-400 py-3 uppercase tracking-widest font-bold text-[10px] hover:text-white transition-colors"
                  >
                    Back to Login
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8">
            <p className="text-[9px] text-gray-500 text-center uppercase tracking-widest font-mono">
              Authorized personnel only. All attempts are logged.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
