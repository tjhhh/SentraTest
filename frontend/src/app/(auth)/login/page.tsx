'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Search, ArrowRight, Globe } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    try {
      setLoading(true);
      const data = await authService.login({ email, password });
      // data expected: { user, accessToken, refreshToken }
      setAuth(data.user, data.accessToken, data.refreshToken);
      router.replace('/dashboard');
    } catch (err: any) {
      setError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 overflow-hidden relative">
      {/* Abstract background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2" />

        <form onSubmit={handleSubmit} className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl mb-4 shadow-xl shadow-indigo-900/50">
            <Search className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">SentraTest</h1>
          <p className="text-slate-400 mt-2">Sign in to your QA dashboard</p>
        </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email-input" className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  id="email-input"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label htmlFor="password-input" className="text-sm font-medium text-slate-300">Password</label>
                <Link href="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">Forgot Password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="password"
                  id="password-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>
            {error && <div className="text-sm text-red-400">{error}</div>}

            <button disabled={loading} type="submit" className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-900/50 disabled:opacity-60">
              {loading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-slate-500 font-bold tracking-widest backdrop-blur-sm">Or continue with</span>
              </div>
            </div>

            <button className="w-full bg-white/5 border border-slate-700 text-slate-300 py-3 rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 font-semibold">
              <Globe className="w-5 h-5" />
              GitHub
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-slate-400 text-sm">
          Don't have an account?{' '}
          <Link href="/register" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Create one now</Link>
        </p>
      </form>
    </div>
  );
}
