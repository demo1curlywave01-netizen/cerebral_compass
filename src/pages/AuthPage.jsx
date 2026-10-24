import React, { useState } from 'react';
import {
  loginWithGoogle,
  loginWithEmail,
  registerWithEmail,
  loginWithDemo,
} from '../services/authService';
import {
  Lock,
  Mail,
  User,
  Phone,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';

export default function AuthPage({ onNavigate, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');

  const handleSuccess = (user) => {
    if (onAuthSuccess) onAuthSuccess(user);
    if (onNavigate) onNavigate('application');
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        if (res.user) {
          handleSuccess(res.user);
        }
        if (res.warning) {
          setInfoMsg(res.warning);
        }
      } else {
        setErrorMsg(res.error || 'Google Sign-In failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Error connecting to Google authentication.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setInfoMsg('');

    try {
      if (mode === 'login') {
        const res = await loginWithEmail(email, password);
        if (res.success && res.user) {
          handleSuccess(res.user);
        } else {
          setErrorMsg(res.error || 'Invalid email or password.');
        }
      } else {
        if (!name.trim()) {
          setErrorMsg('Full Candidate Name is required.');
          setLoading(false);
          return;
        }
        const res = await registerWithEmail(email, password, name, phone);
        if (res.success && res.user) {
          handleSuccess(res.user);
        } else {
          setErrorMsg(res.error || 'Registration failed.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (type) => {
    const res = loginWithDemo(type);
    if (res.success && res.user) {
      handleSuccess(res.user);
    }
  };

  return (
    <div className="pt-28 pb-20 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-sky-100 shadow-2xl relative overflow-hidden">
        {/* Glow corner accents */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Official Candidate Portal</span>
          </div>
          <h1 className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' ? 'Candidate Sign In' : 'Create Candidate Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {mode === 'login'
              ? 'Access your dossier, counsellor allocations, and installment payments.'
              : 'Register to unlock tailored choice sheets and 2-installment fee tracking.'}
          </p>
        </div>

        {/* Alert & Error notifications */}
        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {infoMsg && (
          <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-sky-600" />
            <span>{infoMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        <div className="space-y-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm shadow-sm transition-all duration-200 hover:shadow hover:-translate-y-0.5 active:translate-y-0"
          >
            {/* Google official SVG logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-mono uppercase text-slate-600 tracking-wider font-bold">
              Or with Email
            </span>
          </div>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="flex bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'login'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              mode === 'register'
                ? 'bg-white text-brand-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Registration
          </button>
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Candidate Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Verma"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number (WhatsApp)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-brand-600 to-sky-600 hover:from-brand-700 hover:to-sky-700 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </span>
            ) : (
              <>
                <span>{mode === 'login' ? 'Sign In & Continue' : 'Create Account & Start Form'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Instant Demo Testing Profiles (Requirement 4 & 5 Verification Helper) */}
        <div className="pt-4 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-slate-600 tracking-wider">
              Quick Demo Personas
            </span>
            <span className="text-[10px] text-brand-600 font-bold bg-brand-50 px-2 py-0.5 rounded-full">
              1-Click Testing
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleDemoSelect('fresh')}
              className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-brand-700">1. Fresh Applicant</div>
              <div className="text-[10px] text-slate-600">New Registration Flow (35%)</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('returning_locked')}
              className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-brand-700">2. Priya Verma</div>
              <div className="text-[10px] text-slate-600">35% Paid, 65% Locked</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('returning_pending')}
              className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-brand-700">3. Rohan Kulkarni</div>
              <div className="text-[10px] text-amber-700 font-bold">65% Open (Pay Now)</div>
            </button>

            <button
              type="button"
              onClick={() => handleDemoSelect('completed')}
              className="p-2.5 text-left rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-all group"
            >
              <div className="font-bold text-slate-800 group-hover:text-brand-700">4. Dr. Aarav Sharma</div>
              <div className="text-[10px] text-emerald-700 font-bold">100% Paid & Receipt</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
