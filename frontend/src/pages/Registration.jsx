import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sprout,
  User,
  Mail,
  Phone,
  Lock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  MapPin,
  Globe,
  Sparkles,
  Tractor,
  Layers,
  Droplets,
  Check,
  ChevronRight,
  Compass
} from 'lucide-react';

const AVATAR_OPTIONS = [
  { id: 'sprout', label: 'Green Sprout', icon: '🌾', desc: 'Budding Agri Innovator' },
  { id: 'farmer', label: 'Progressive Farmer', icon: '👨‍🌾', desc: 'Expert Field Manager' },
  { id: 'tractor', label: 'Smart Equipment', icon: '🚜', desc: 'Tech-Driven Farming' },
  { id: 'sunflower', label: 'Crop Specialist', icon: '🌻', desc: 'High-Yield Producer' },
  { id: 'water', label: 'Hydro Manager', icon: '💧', desc: 'Precision Irrigation' },
  { id: 'scientist', label: 'Agri Scientist', icon: '🔬', desc: 'Soil & Climate Analyst' },
];

const SOIL_TYPES = [
  'Black Soil',
  'Red Soil',
  'Alluvial Soil',
  'Laterite Soil',
  'Sandy Soil',
  'Clayey Soil',
  'Loamy Soil',
];

const POPULAR_CROPS = [
  'Paddy (Rice)',
  'Cotton',
  'Maize',
  'Chilli',
  'Vegetables',
  'Pulses',
  'Wheat',
  'Sugarcane',
  'Groundnut',
  'Soybean',
];

const IRRIGATION_SOURCES = [
  'Borewell',
  'Canal',
  'Rainfed',
  'Drip System',
  'Sprinkler',
  'Mixed',
];

const INDIAN_STATES = [
  'Telangana',
  'Andhra Pradesh',
  'Maharashtra',
  'Punjab',
  'Karnataka',
  'Uttar Pradesh',
  'Tamil Nadu',
  'Madhya Pradesh',
  'Gujarat',
  'Haryana',
];

export default function Registration() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { register, verifyOTP, resendOTP, updateUserProfile } = useAuth();

  // Step logic (1: Account Details, 2: OTP Verification, 3: Profile Creation)
  const initialStep = searchParams.get('step') === 'verify' ? 2 : 1;
  const [step, setStep] = useState(initialStep);

  // Form State - Step 1
  const [formData, setFormData] = useState({
    name: '',
    email: searchParams.get('email') || '',
    phone: '',
    password: '',
    role: 'Farmer',
    state: 'Telangana',
    district: 'Warangal',
    preferredLanguage: 'en',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Form State - Step 2 (OTP)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const otpInputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  // Form State - Step 3 (Profile Setup)
  const [profileData, setProfileData] = useState({
    avatar: 'sprout',
    landSizeAcres: 5,
    soilType: 'Black Soil',
    primaryCrops: ['Paddy (Rice)', 'Cotton'],
    irrigationSource: 'Borewell',
  });

  // UI state
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Timer cooldown logic
  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  // Focus first OTP field on entering Step 2
  useEffect(() => {
    if (step === 2 && otpInputRefs[0]?.current) {
      otpInputRefs[0].current.focus();
    }
  }, [step]);

  // Handle Step 1 Registration Submission
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await register(formData);
      if (res.success && res.requiresOtp) {
        setStep(2);
        setSuccessMsg(`Verification code sent via EmailJS to ${formData.email}`);
        setCooldown(45);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste of 6-digit code
      const cleaned = value.replace(/\D/g, '').slice(0, 6);
      if (cleaned.length > 0) {
        const newDigits = [...otpDigits];
        for (let i = 0; i < 6; i++) {
          newDigits[i] = cleaned[i] || '';
        }
        setOtpDigits(newDigits);
        const nextIndex = Math.min(cleaned.length, 5);
        otpInputRefs[nextIndex]?.current?.focus();
      }
      return;
    }

    const digit = value.replace(/\D/g, '');
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);

    if (digit && index < 5) {
      otpInputRefs[index + 1]?.current?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs[index - 1]?.current?.focus();
    }
  };

  // Handle Step 2 OTP Verification
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const fullOtp = otpDigits.join('');

    if (fullOtp.length !== 6) {
      setError('Please enter all 6 digits of the OTP code.');
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOTP(formData.email, fullOtp);
      if (res.success) {
        setSuccessMsg('Email verified successfully! Let’s complete your farm profile.');
        // Advance to Step 3 Profile Creation
        setStep(3);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid or expired OTP code. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Resend OTP
  const handleResend = async () => {
    if (cooldown > 0) return;
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      await resendOTP(formData.email);
      setSuccessMsg('A fresh verification code has been dispatched to your email address.');
      setCooldown(45);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 3 Profile Creation Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await updateUserProfile({
        avatar: profileData.avatar,
        landSizeAcres: Number(profileData.landSizeAcres),
        soilType: profileData.soilType,
        primaryCrops: profileData.primaryCrops,
        irrigationSource: profileData.irrigationSource,
        state: formData.state,
        district: formData.district,
        preferredLanguage: formData.preferredLanguage,
      });

      navigate('/dashboard');
    } catch (err) {
      // Even if profile update encounters a minor issue, route to dashboard since user is authenticated
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  // Toggle crop selection tag
  const toggleCrop = (cropName) => {
    if (profileData.primaryCrops.includes(cropName)) {
      setProfileData({
        ...profileData,
        primaryCrops: profileData.primaryCrops.filter((c) => c !== cropName),
      });
    } else {
      setProfileData({
        ...profileData,
        primaryCrops: [...profileData.primaryCrops, cropName],
      });
    }
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { label: '', color: '', percent: 0 };
    if (pwd.length < 6) return { label: 'Weak', color: 'bg-red-500', percent: 33 };
    if (pwd.length < 10 || !/\d/.test(pwd)) return { label: 'Medium', color: 'bg-amber-500', percent: 66 };
    return { label: 'Strong', color: 'bg-emerald-500', percent: 100 };
  };

  const pwdStrength = getPasswordStrength();

  return (
    <div className="relative min-h-[calc(100vh-80px)] py-8 px-4 flex flex-col justify-center items-center overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-agri-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="w-full max-w-2xl mx-auto">
        
        {/* Main Card */}
        <div className="glass-card p-6 sm:p-10 shadow-2xl border border-slate-800/90 relative overflow-hidden backdrop-blur-xl">
          
          {/* Top Header Badge */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-agri-500/20 to-emerald-500/20 text-agri-400 rounded-2xl border border-agri-500/30 shadow-inner">
                <Sprout className="w-7 h-7 animate-pulse-slow" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight font-display">AgriQura AI</h1>
                <p className="text-xs text-slate-400">Smart Agriculture & Soil Advisory Portal</p>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Multi-Step Onboarding</span>
            </div>
          </div>

          {/* 3-STEP PROGRESS STEPPER */}
          <div className="mb-8">
            <div className="relative flex items-center justify-between max-w-lg mx-auto">
              
              {/* Connecting Line Background */}
              <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
              
              {/* Active Progress Fill Line */}
              <div
                className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-agri-500 via-emerald-400 to-amber-400 rounded-full transition-all duration-500 ease-out z-0"
                style={{
                  width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                }}
              />

              {/* STEP 1 ITEM */}
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => step > 1 && setStep(1)}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step === 1
                      ? 'bg-gradient-to-br from-agri-500 to-emerald-600 text-white ring-4 ring-agri-500/30 shadow-lg shadow-agri-900/50 scale-110'
                      : step > 1
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-500 border border-slate-700'
                  }`}
                >
                  {step > 1 ? <Check className="w-5 h-5" /> : 1}
                </div>
                <span className={`text-[11px] font-semibold tracking-wide ${step === 1 ? 'text-agri-400 font-bold' : step > 1 ? 'text-slate-300' : 'text-slate-500'}`}>
                  Account Details
                </span>
              </div>

              {/* STEP 2 ITEM */}
              <div className="relative z-10 flex flex-col items-center gap-2 group cursor-pointer" onClick={() => step === 3 && setStep(2)}>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step === 2
                      ? 'bg-gradient-to-br from-agri-500 to-emerald-600 text-white ring-4 ring-agri-500/30 shadow-lg shadow-agri-900/50 scale-110'
                      : step > 2
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-900 text-slate-500 border border-slate-700'
                  }`}
                >
                  {step > 2 ? <Check className="w-5 h-5" /> : 2}
                </div>
                <span className={`text-[11px] font-semibold tracking-wide ${step === 2 ? 'text-agri-400 font-bold' : step > 2 ? 'text-slate-300' : 'text-slate-500'}`}>
                  Email Verification
                </span>
              </div>

              {/* STEP 3 ITEM */}
              <div className="relative z-10 flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step === 3
                      ? 'bg-gradient-to-br from-amber-500 to-agri-500 text-white ring-4 ring-amber-500/30 shadow-lg shadow-amber-900/50 scale-110'
                      : 'bg-slate-900 text-slate-500 border border-slate-700'
                  }`}
                >
                  3
                </div>
                <span className={`text-[11px] font-semibold tracking-wide ${step === 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
                  Profile Setup
                </span>
              </div>

            </div>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-400 flex items-start gap-3 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 1: ACCOUNT DETAILS */}
          {/* ======================================================== */}
          {step === 1 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-5 animate-fade-in">
              
              <div className="space-y-1 mb-2">
                <h2 className="text-lg font-bold text-white">Create Your Account</h2>
                <p className="text-xs text-slate-400">Step 1 of 3: Provide your personal details and location</p>
              </div>

              {/* Role Selection Chips */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">I am registering as:</label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { id: 'Farmer', label: 'Farmer', icon: '🌾', desc: 'Crop Owner' },
                    { id: 'Expert', label: 'Agri Expert', icon: '🔬', desc: 'Scientist / Advisor' },
                    { id: 'Admin', label: 'Agri Business', icon: '🏭', desc: 'Distributor' },
                  ].map((roleItem) => (
                    <button
                      key={roleItem.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, role: roleItem.id })}
                      className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col justify-between ${
                        formData.role === roleItem.id
                          ? 'bg-agri-950/80 border-agri-500/80 ring-2 ring-agri-500/40 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="text-lg mb-1">{roleItem.icon}</div>
                      <div>
                        <div className="text-xs font-bold">{roleItem.label}</div>
                        <div className="text-[10px] text-slate-500">{roleItem.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field text-xs sm:text-sm"
                      placeholder="e.g. Vignesh"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field pl-10 text-xs sm:text-sm"
                      placeholder="+91 98855XXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input-field pl-10 text-xs sm:text-sm"
                    placeholder="farmer@gmail.com"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Verification code will be sent via EmailJS to this address.</p>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                
                {/* Password strength bar */}
                {formData.password && (
                  <div className="mt-2 space-y-1">
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${pwdStrength.color}`}
                        style={{ width: `${pwdStrength.percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Password strength:</span>
                      <span className="font-semibold">{pwdStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Preferred Language */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-agri-400" />
                  <span>Preferred Advisory Language</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { code: 'en', label: 'English 🇬🇧' },
                    { code: 'hi', label: 'हिन्दी (Hindi) 🇮🇳' },
                    { code: 'te', label: 'తెలుగు (Telugu) 🏛️' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setFormData({ ...formData, preferredLanguage: lang.code })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        formData.preferredLanguage === lang.code
                          ? 'bg-agri-600/30 border-agri-500 text-agri-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* State and District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>State</span>
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="input-field text-xs sm:text-sm bg-slate-900"
                  >
                    {INDIAN_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">District</label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="input-field text-xs sm:text-sm"
                    placeholder="e.g. Warangal / Nizamabad"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-4 text-sm font-semibold mt-4 shadow-xl shadow-agri-950/50"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending OTP Verification Code...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Continue to Email Verification <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-400">
                Already registered?{' '}
                <Link to="/login" className="text-agri-400 font-semibold hover:underline">
                  Sign in here
                </Link>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 2: EMAIL OTP VERIFICATION */}
          {/* ======================================================== */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="space-y-6 animate-fade-in">
              
              <div className="text-center space-y-3">
                <div className="inline-flex p-3 bg-gradient-to-br from-agri-500/20 to-emerald-500/20 text-agri-400 rounded-2xl border border-agri-500/40 shadow-inner">
                  <KeyRound className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-display">Verify Email Address</h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    Step 2 of 3: Enter the 6-digit OTP code dispatched to{' '}
                    <span className="text-agri-400 font-semibold">{formData.email}</span>
                  </p>
                </div>
              </div>

              {/* 6 Digit Input Boxes */}
              <div className="flex items-center justify-center gap-2 sm:gap-3 py-4">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpInputRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-slate-900 border border-slate-700/80 rounded-xl text-agri-400 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent transition-all shadow-inner"
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length !== 6}
                className="btn-primary w-full py-4 text-sm font-semibold shadow-xl shadow-agri-950/50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Verifying OTP...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify OTP & Continue to Profile Setup <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              {/* Bottom controls */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="hover:text-white flex items-center gap-1 transition-colors"
                >
                  ← Edit Account Details
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="text-agri-400 hover:underline disabled:opacity-50 disabled:no-underline font-semibold flex items-center gap-1"
                >
                  {cooldown > 0 ? (
                    <span className="text-slate-400">Resend code in <strong className="text-amber-400">{cooldown}s</strong></span>
                  ) : (
                    'Resend Verification Code'
                  )}
                </button>
              </div>

            </form>
          )}

          {/* ======================================================== */}
          {/* STEP 3: PROFILE CREATION */}
          {/* ======================================================== */}
          {step === 3 && (
            <form onSubmit={handleProfileSubmit} className="space-y-6 animate-fade-in">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-gradient-to-br from-amber-500/20 to-agri-500/20 text-amber-400 rounded-2xl border border-amber-500/40 shadow-inner">
                  <Compass className="w-8 h-8 animate-spin-slow" />
                </div>
                <h2 className="text-xl font-bold text-white font-display">Personalize Farm Profile</h2>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Step 3 of 3: Provide crop details so Groq AI can calculate accurate soil, moisture & advisory insights.
                </p>
              </div>

              {/* 1. Avatar Picker */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Choose Avatar Badge:</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATAR_OPTIONS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, avatar: av.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                        profileData.avatar === av.id
                          ? 'bg-agri-950 border-agri-500 ring-2 ring-agri-500/40 text-white shadow-lg scale-105'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl">{av.icon}</span>
                      <span className="text-[10px] font-semibold truncate w-full">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Land Size in Acres */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Tractor className="w-4 h-4 text-amber-400" />
                    <span>Total Farm Land Size (Acres)</span>
                  </span>
                  <span className="text-agri-400 font-bold text-xs">{profileData.landSizeAcres} Acres</span>
                </label>
                
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[2, 5, 10, 20].map((acres) => (
                    <button
                      key={acres}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, landSizeAcres: acres })}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        profileData.landSizeAcres === acres
                          ? 'bg-agri-600 text-white border-agri-500 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {acres} Acres
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="0.5"
                  max="500"
                  step="0.5"
                  value={profileData.landSizeAcres}
                  onChange={(e) => setProfileData({ ...profileData, landSizeAcres: e.target.value })}
                  className="input-field text-xs sm:text-sm"
                  placeholder="Or enter custom acres (e.g. 7.5)"
                />
              </div>

              {/* 3. Soil Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-emerald-400" />
                  <span>Soil Classification</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {SOIL_TYPES.map((soil) => (
                    <button
                      key={soil}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, soilType: soil })}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                        profileData.soilType === soil
                          ? 'bg-emerald-600 text-white border-emerald-500 font-semibold shadow-md'
                          : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {soil}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Primary Crops Selector (Multi-Select Tags) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Sprout className="w-4 h-4 text-agri-400" />
                    <span>Primary Crops Cultivated</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Select all that apply</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_CROPS.map((crop) => {
                    const isSelected = profileData.primaryCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-agri-950 border-agri-500/80 text-agri-300 font-bold ring-1 ring-agri-500/40'
                            : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-agri-400" />}
                        <span>{crop}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 5. Irrigation Source */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Main Irrigation Water Source</span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {IRRIGATION_SOURCES.map((src) => (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setProfileData({ ...profileData, irrigationSource: src })}
                      className={`py-2 px-2 rounded-xl border text-[11px] font-medium text-center transition-all ${
                        profileData.irrigationSource === src
                          ? 'bg-blue-600/30 border-blue-500 text-blue-200 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {src}
                    </button>
                  ))}
                </div>
              </div>

              {/* Final Submit & Skip Buttons */}
              <div className="pt-4 space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full py-4 text-sm font-semibold shadow-xl shadow-agri-950/50"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Profile...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Complete Profile & Launch Dashboard 🚀 <ChevronRight className="w-4 h-4" />
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Skip for Now & Go to Dashboard
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
