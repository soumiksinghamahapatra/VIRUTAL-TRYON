import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle, Eye, EyeOff, Check, ShieldCheck } from 'lucide-react';

/**
 * Curated list of fashion archetypes for profile customization
 */
const FASHION_ARCHETYPES = [
  'Quiet Luxury',
  'Minimalist',
  'Casual Chic',
  'French Elegant',
  'Tailored Workwear',
  'Haute Couture'
];

/**
 * Register Page Component
 * Collects client name, credentials, aesthetic archetypes, and body silhouettes.
 */
const Register = () => {
  // --- Form State ---
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedAesthetics, setSelectedAesthetics] = useState(['Quiet Luxury', 'Minimalist']);
  const [bodyType, setBodyType] = useState('Hourglass');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // --- UI State ---
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // --- Auth & Navigation ---
  const { register } = useAuth();
  const navigate = useNavigate();

  // --- Toggle Aesthetic Selection ---
  const handleToggleAesthetic = (archetype) => {
    setSelectedAesthetics((currentList) =>
      currentList.includes(archetype)
        ? currentList.filter((item) => item !== archetype)
        : [...currentList, archetype]
    );
  };

  // --- Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation Checks
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the MAISON Private Client terms to proceed.');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        aesthetics: selectedAesthetics,
        bodyType,
      });

      // Redirect new clients to 12-Season Color Analysis
      navigate('/color-analysis');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to establish account. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-white text-black">
      <div className="max-w-lg w-full bg-white border border-neutral-300 p-8 sm:p-12 shadow-xl space-y-8">
        
        {/* 1. Header Section */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-400">
            Client Enrollment
          </span>
          <h1 className="font-serif text-4xl font-light text-black">
            Join MAISON Atelier
          </h1>
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            Create your client profile to unlock custom color palettes and digital closet archiving.
          </p>
        </div>

        {/* 2. Error Banner */}
        {error && (
          <div className="p-4 border border-red-300 bg-red-50 text-red-800 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* 3. Enrollment Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Personal Info Fields */}
          <div className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Eleanor Vance"
                className="w-full text-xs border border-neutral-300 p-3 text-black bg-white focus:border-black outline-none transition-colors"
              />
            </div>

            {/* Email Address */}
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

            {/* Password with Visibility Toggle */}
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
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password Rule Indicator */}
              {password && (
                <p className={`text-[10px] mt-1.5 flex items-center gap-1 ${password.length >= 6 ? 'text-green-700' : 'text-neutral-400'}`}>
                  {password.length >= 6 ? <Check className="w-3 h-3" /> : '•'} Minimum 6 characters
                </p>
              )}
            </div>
          </div>

          {/* Style Archetypes Selector */}
          <div className="border-t border-neutral-200 pt-4 space-y-2.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
              Style Archetypes (Pick Your Preferred Styles)
            </label>
            <div className="flex flex-wrap gap-2">
              {FASHION_ARCHETYPES.map((archetype) => {
                const isSelected = selectedAesthetics.includes(archetype);
                return (
                  <button
                    key={archetype}
                    type="button"
                    onClick={() => handleToggleAesthetic(archetype)}
                    className={`px-3 py-1.5 text-xs transition-all ${
                      isSelected
                        ? 'bg-black text-white'
                        : 'border border-neutral-300 text-neutral-600 hover:border-black hover:text-black bg-white'
                    }`}
                  >
                    {archetype}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Silhouette / Body Proportion */}
          <div className="space-y-1.5">
            <label className="block text-[11px] uppercase tracking-wider font-semibold text-neutral-700">
              Body Silhouette Proportion
            </label>
            <select
              value={bodyType}
              onChange={(e) => setBodyType(e.target.value)}
              className="w-full text-xs border border-neutral-300 p-2.5 bg-white text-black focus:border-black outline-none"
            >
              <option value="Hourglass">Hourglass</option>
              <option value="Rectangle">Rectangle / Column</option>
              <option value="Pear">Inverted Triangle / Athletic</option>
              <option value="Petite">Petite & Tailored</option>
              <option value="Curvy">Curvy / Plus</option>
            </select>
          </div>

          {/* Terms Agreement Checkbox */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="termsAgreement"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="accent-black w-3.5 h-3.5 cursor-pointer"
            />
            <label htmlFor="termsAgreement" className="text-[11px] text-neutral-500 cursor-pointer select-none">
              I agree to the MAISON Private Client terms and AI styling policies.
            </label>
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
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Establish Atelier Profile</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* 4. Switch to Sign In */}
        <div className="text-center pt-2 border-t border-neutral-100">
          <p className="text-xs text-neutral-500 font-light">
            Already registered?{' '}
            <Link to="/login" className="font-semibold text-black hover:underline uppercase tracking-wider text-[11px]">
              Sign In to Your Account &rarr;
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
