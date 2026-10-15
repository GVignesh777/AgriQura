import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import { Sprout, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, ShieldAlert } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUnverifiedEmail('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.response?.data?.requiresOtp) {
        setUnverifiedEmail(email);
        setError('Your email is registered but not verified yet. Verification code sent!');
      } else {
        setError(err.response?.data?.error || 'Invalid email or password');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    setUnverifiedEmail('');
    setLoading(true);

    try {
      if (!credentialResponse?.credential) {
        throw new Error('Google did not return a valid authentication credential.');
      }
      const res = await googleLogin(credentialResponse.credential);
      if (res.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google Sign-In Error:', err);
      setError(err.response?.data?.error || err.message || 'Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError('Google Sign-In popup failed or was cancelled.');
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 px-4 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-agri-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[250px] h-[250px] bg-emerald-500/10 blur-[90px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-md mx-auto">
        <div className="glass-card p-6 sm:p-10 shadow-2xl border border-slate-800/90 relative overflow-hidden backdrop-blur-xl space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex p-3.5 bg-gradient-to-br from-agri-500/20 to-emerald-500/20 text-agri-400 rounded-2xl border border-agri-500/30 shadow-inner">
              <Sprout className="w-8 h-8 animate-pulse-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight font-display">Welcome Back</h1>
              <p className="text-xs text-slate-400 mt-1">Sign in to manage your crops, land & Groq AI advisory</p>
            </div>
          </div>

          {/* Errors / Warnings */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Unverified Account Redirect Banner */}
          {unverifiedEmail && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Verification Required</span>
              </div>
              <p className="text-[11px] text-amber-400/90">
                Please complete email verification to activate your account.
              </p>
              <Link
                to={`/register?email=${encodeURIComponent(unverifiedEmail)}&step=verify`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 border border-amber-500/40 rounded-lg text-amber-300 font-bold hover:bg-amber-500/30 transition-all text-[11px]"
              >
                Proceed to OTP Verification →
              </Link>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10 text-xs sm:text-sm"
                  placeholder="farmer@gmail.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10 pr-10 text-xs sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 text-xs"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-semibold mt-2 shadow-xl shadow-agri-950/50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-800"></div>
            <span className="flex-shrink mx-4 text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Or continue with</span>
            <div className="flex-grow border-t border-slate-800"></div>
          </div>

          {/* Google OAuth Button */}
          <div className="flex justify-center w-full min-h-[44px]">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="filled_black"
              shape="pill"
              size="large"
              width="100%"
              text="signin_with"
            />
          </div>

          {/* Footer Link */}
          <div className="pt-2 text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-agri-400 font-semibold hover:underline">
              Register now
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
