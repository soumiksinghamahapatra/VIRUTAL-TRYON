import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, ShieldCheck, Check } from 'lucide-react';

const AESTHETICS_LIST = [
  'Quiet Luxury',
  'Minimalist',
  'Casual Chic',
  'French Elegant',
  'Tailored Workwear',
  'Haute Couture'
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAesthetics, setSelectedAesthetics] = useState(['Quiet Luxury', 'Minimalist']);
  const [bodyType, setBodyType] = useState('Hourglass');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const toggleAesthetic = (item) => {
    if (selectedAesthetics.includes(item)) {
      setSelectedAesthetics(selectedAesthetics.filter((a) => a !== item));
    } else {
      setSelectedAesthetics([...selectedAesthetics, item]);
    }
  };

  const isPasswordStrong = password.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreeTerms) {
      setError('Please accept the MAISON Atelier terms to create an account.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name,
        email,
        password,
        aesthetics: selectedAesthetics,
        bodyType,
      });
      navigate('/color-analysis');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to establish account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-white text-black">
      <div className="max-w-lg w-full bg-white border border-neutral-300 p-8 sm:p-12 shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
            Client Enrollment
          </span>
          <h1 className="font-serif text-4xl font-light text-black">
            Join MAISON Atelier
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Create your profile to unlock custom 12-season color formulas, digital closet archives, and virtual fitting room privileges.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Eleanor Vance"
                className="w-full text-xs border border-neutral-300 p-3 text-black bg-white focus:border-black outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="eleanor@domain.com"
                className="w-full text-xs border border-neutral-300 p-3 text-black bg-white focus:border-black outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs border border-neutral-300 p-3 pr-10 text-black bg-white focus:border-black outline-none tracking-wider transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <p className={`text-[10px] mt-1.5 flex items-center gap-1 ${isPasswordStrong ? 'text-green-700' : 'text-neutral-400'}`}>
                  {isPasswordStrong ? <Check className="w-3 h-3" /> : '•'} Minimum 6 characters met
                </p>
              )}
            </div>
          </div>

          {/* Aesthetic Preferences */}
          <div className="border-t border-neutral-200 pt-4 space-y-3">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
              Style Archetypes (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {AESTHETICS_LIST.map((aes) => {
                const selected = selectedAesthetics.includes(aes);
                return (
                  <button
                    key={aes}
                    type="button"
                    onClick={() => toggleAesthetic(aes)}
                    className={`px-3 py-1.5 text-xs transition-all ${
                      selected
                        ? 'bg-black text-white'
                        : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black bg-white'
                    }`}
                  >
                    {aes}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Body Silhouette */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
              Silhouette Proportion
            </label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full text-xs border border-neutral-300 p-2.5 bg-white text-black focus:border-black outline-none"
            >
              <option value="Hourglass">Hourglass Proportion</option>
              <option value="Rectangle">Rectangle / Column</option>
              <option value="Pear">Inverted Triangle / Athletic</option>
              <option value="Petite">Petite & Tailored</option>
              <option value="Curvy">Curvy / Plus</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-black w-3.5 h-3.5"
            />
            <label htmlFor="terms" className="text-[11px] text-neutral-500 cursor-pointer">
              I agree to the MAISON Private Client Terms & AI Styling Protocols.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black text-white hover:bg-neutral-800 disabled:opacity-50 text-xs uppercase tracking-[0.25em] font-semibold transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Establishing Profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Create Atelier Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 font-light">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline uppercase tracking-wider text-[11px]">
              Sign In &rarr;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
