import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle, ShieldCheck } from 'lucide-react';

/**
 * Login Page Component
 * Handles client authentication, password visibility toggling, and fast demo access.
 */
const Login = () => {
  // --- Form State ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // --- UI State ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Navigation & Auth ---
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || '/wardrobe';

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic Validation
    if (!email.trim() || !password) {
      setError('Please provide both your email address and password.');
      return;
    }

    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid email or password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // --- Demo Account Helper ---
  const fillDemoAccount = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-white text-black">
      <div className="max-w-md w-full bg-white border border-neutral-300 p-8 sm:p-12 shadow-xl space-y-8">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
            Private Access
          </span>
          <h1 className="font-serif text-4xl font-light text-black">
            Sign In to Atelier
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Enter your credentials to access your styling studio and digital wardrobe.
          </p>
        </div>

        {/* 2. Fast Demo Logins */}
        <div className="border border-neutral-200 p-3.5 bg-neutral-50/70 space-y-2">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-black" /> Quick Demo Accounts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('demo@maison.com', 'Password123!')}
              className="px-2.5 py-1.5 text-[11px] font-medium border border-neutral-300 bg-white hover:border-black text-black transition-colors text-left truncate"
            >
              VIP: demo@maison.com
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('stylist@maison.com', 'Password123!')}
              className="px-2.5 py-1.5 text-[11px] font-medium border border-neutral-300 bg-white hover:border-black text-black transition-colors text-left truncate"
            >
              Stylist: stylist@maison.com
            </button>
          </div>
        </div>

        {/* 3. Error Alert (if present) */}
        {error && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 4. Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email Field */}
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@maison.com"
              className="w-full text-xs border border-neutral-300 p-3 text-black bg-white focus:border-black outline-none transition-colors"
            />
          </div>

          {/* Password Field with Show/Hide Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset instructions dispatched to your email address.')}
                className="text-[10px] text-neutral-400 hover:text-black uppercase tracking-wider underline"
              >
                Forgot Password?
              </button>
            </div>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs border border-neutral-300 p-3 pr-10 text-black bg-white focus:border-black outline-none tracking-wider transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-neutral-400 hover:text-black transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Security Badge */}
          <div className="flex items-center justify-between text-xs text-neutral-600 pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-black w-3.5 h-3.5"
              />
              <span className="text-[11px]">Remember on this device</span>
            </label>
            <span className="flex items-center gap-1 text-[11px] text-neutral-400">
              <ShieldCheck className="w-3.5 h-3.5 text-black" /> 256-Bit SSL
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to Atelier</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 5. Switch to Registration */}
        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 font-light">
            New to MAISON?{' '}
            <Link to="/register" className="font-semibold text-black hover:underline uppercase tracking-wider text-[11px]">
              Apply for Atelier Access &rarr;
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
