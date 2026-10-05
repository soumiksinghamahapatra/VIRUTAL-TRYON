import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/wardrobe';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@MAISON.com');
    setPassword('Password123!');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#000000] text-[#D4D4D4] flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#000000]">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-[#525252]">
            Sign in to access your digital closet and styling consultations.
          </p>
        </div>

        {/* Demo Fast Fill Button */}
        <button
          type="button"
          onClick={handleFillDemo}
          className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#000000] bg-[#FAFAFA]/60 hover:bg-[#FAFAFA] text-xs font-semibold text-[#404040] flex items-center justify-center gap-2 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#000000]" />
          Fill Demo Account (demo@MAISON.com)
        </button>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4D4D4] focus:border-[#000000] focus:outline-none text-sm text-[#000000] bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4D4D4] focus:border-[#000000] focus:outline-none text-sm text-[#000000] bg-[#FFFFFF]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#000000] text-[#FFFFFF] font-semibold text-sm hover:bg-[#171717] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#525252]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-[#000000] hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
