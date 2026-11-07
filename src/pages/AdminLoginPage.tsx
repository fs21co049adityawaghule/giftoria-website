import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, Lock, User, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLoginPage: React.FC = () => {
  const [, setLocation] = useLocation();
  const { adminLogin, isAdminAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated as admin, allow direct entry
  if (isAdminAuthenticated) {
    setLocation('/admin');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please provide your admin username and secret access key.');
      return;
    }

    setIsLoading(true);
    const success = adminLogin(username, password);
    setIsLoading(false);

    if (success) {
      setLocation('/admin');
    } else {
      setError('Invalid admin credentials. Access denied.');
      showToast('Unauthorized: Invalid administrator credentials.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto space-y-6">
        
        {/* Brand / Title */}
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/10">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            GIFTORIA Administration
          </h1>
          <p className="text-xs text-slate-400 mt-1.5">
            Internal Management Portal • Confidential Business Operations
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-slate-800/80 backdrop-blur-md rounded-3xl border border-slate-700/60 p-8 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-700/60 text-xs font-bold text-amber-400 uppercase tracking-wider">
            <Lock className="w-4 h-4" />
            <span>Authorized Manager Authentication</span>
          </div>

          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Username / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoFocus
                  placeholder="admin@giftoria.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Password / Authorization PIN
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>Access Admin Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>Restricted Access</span>
            <button
              type="button"
              onClick={() => setLocation('/')}
              className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3 h-3" />
              <span>Back to Store</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          This portal is strictly reserved for GIFTORIA verified administrators.
          Unauthorized access attempts are monitored and logged.
        </p>
      </div>
    </div>
  );
};
