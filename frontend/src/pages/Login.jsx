import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck,
  Camera,
  Upload,
  Trash2,
} from 'lucide-react';
import { SAMPLE_AVATARS } from '../utils/avatarUtils';

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    avatar: '',
    rememberMe: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMessage) setErrorMessage('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please select a valid image file');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 400;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, avatar: dataUrl }));
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (isSignUp && !formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      // Connect to backend API if running
      const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login';
      const payload = isSignUp 
        ? { name: formData.name, email: formData.email, password: formData.password, avatar: formData.avatar }
        : { email: formData.email, password: formData.password };

      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed. Please check your credentials.');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setSuccessMessage(isSignUp ? 'Account created successfully! Redirecting...' : 'Welcome back! Redirecting...');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);

    } catch (err) {
      if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
        setErrorMessage('Cannot reach backend server. Please verify the backend is running.');
      } else {
        setErrorMessage(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Decorative ambient gradient glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[40%] right-[20%] w-[350px] h-[350px] bg-violet-600/15 rounded-full blur-[110px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Left Side: Branding & Feature Highlights (Visible on lg screens) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-6">
          <div>


            <h1 className="text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
              Master your daily habits, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-emerald-400 bg-clip-text text-transparent">
                transform your life.
              </span>
            </h1>
            <p className="text-slate-400 text-base leading-relaxed max-w-md">
              Track consistency, build unbroken streaks, and gain actionable insights into your daily routines.
            </p>
          </div>

          {/* Value Highlights */}
          <div className="space-y-4">
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 shrink-0">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Streak Momentum</h4>
                <p className="text-xs text-slate-400">Never break the chain with real-time streak trackers.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Consistency Analytics</h4>
                <p className="text-xs text-slate-400">Visualize completions over 30 days and 8 weeks.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-md">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Private & Secure</h4>
                <p className="text-xs text-slate-400">Encrypted credentials with JWT token authentication.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>Join thousands building disciplined daily routines.</span>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="relative rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl backdrop-blur-2xl p-6 sm:p-8">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  {isSignUp ? 'Create your account' : 'Welcome back'}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {isSignUp ? 'Start building positive habits in minutes' : 'Sign in to access your habit dashboard'}
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <Flame className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Account Required Notice */}
            <div className="mb-5 p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-200 text-xs flex items-center gap-2.5">
              <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>Sign in or create a free account to enter and manage your habits.</span>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="flex p-1 rounded-xl bg-slate-950/70 border border-slate-800 mb-6">
              <button
                type="button"
                id="tab-signin"
                onClick={() => { setIsSignUp(false); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  !isSignUp 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                id="tab-signup"
                onClick={() => { setIsSignUp(true); setErrorMessage(''); setSuccessMessage(''); }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  isSignUp 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2">
                <span className="font-bold">Notice:</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="flex flex-col items-center justify-center pb-1">
                  <div className="relative group">
                    <div className="w-18 h-18 rounded-2xl overflow-hidden bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/20">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] overflow-hidden flex items-center justify-center">
                        {formData.avatar ? (
                          <img
                            src={formData.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-7 h-7 text-slate-500" />
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor="signup-avatar"
                      title="Upload profile photo"
                      className="absolute -bottom-1 -right-1 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-md border-2 border-slate-900 cursor-pointer transition-all active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <input
                        id="signup-avatar"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-1.5">
                    {formData.avatar ? 'Photo selected' : 'Upload Device Image or Pick Avatar'}
                  </span>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, avatar: '' }))}
                      className="text-[10px] text-rose-400 hover:underline mt-0.5 cursor-pointer"
                    >
                      Reset to Default
                    </button>
                  )}

                  {/* Sample Avatars Row */}
                  <div className="w-full mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-medium text-slate-400">
                        Or pick a sample avatar:
                      </span>
                      <span className="text-[10px] text-slate-500">{SAMPLE_AVATARS.length} available</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none">
                      {SAMPLE_AVATARS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, avatar: item.url }))}
                          title={item.name}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 hover:scale-105 ${
                            formData.avatar === item.url
                              ? 'border-indigo-500 ring-2 ring-indigo-500/50 scale-105'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {isSignUp && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="name">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="e.g. Priyanshu Ojha"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@domain.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="password">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-slate-950/70 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isSignUp && (
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300 select-none">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="rounded border-slate-800 bg-slate-950 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                    />
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                    Forgot password?
                  </a>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="submit-auth-btn"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Free Account' : 'Sign In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Footer switcher */}
            <p className="text-center text-xs text-slate-500 mt-6">
              {isSignUp ? 'Already have an account? ' : "Don't have an account yet? "}
              <button
                type="button"
                onClick={() => { setIsSignUp(!isSignUp); setErrorMessage(''); setSuccessMessage(''); }}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer ml-1"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;