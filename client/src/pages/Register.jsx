import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

const AESTHETICS_LIST = [
  'Quiet Luxury',
  'Minimalist',
  'Casual Chic',
  'French Elegant',
  'Streetwear',
  'Tailored Workwear',
];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedAesthetics, setSelectedAesthetics] = useState(['Quiet Luxury', 'Casual Chic']);
  const [bodyType, setBodyType] = useState('Hourglass');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
      setError(err.response?.data?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E5E5E5] shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#000000] text-[#D4D4D4] flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#000000]">
            Begin Your Style Journey
          </h2>
          <p className="text-xs sm:text-sm text-[#525252]">
            Create an MAISON account for personalized color matching and wardrobe curation.
          </p>
        </div>

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
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Clara Dupont"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4D4D4] focus:border-[#000000] focus:outline-none text-sm text-[#000000] bg-[#FFFFFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clara@example.com"
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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
              className="w-full px-4 py-2.5 rounded-xl border border-[#D4D4D4] focus:border-[#000000] focus:outline-none text-sm text-[#000000] bg-[#FFFFFF]"
            />
          </div>

          {/* Aesthetics Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#000000] mb-2">
              Style Aesthetics (Select Preferred)
            </label>
            <div className="flex flex-wrap gap-2">
              {AESTHETICS_LIST.map((item) => {
                const isSelected = selectedAesthetics.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAesthetic(item)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-[#000000] text-[#FFFFFF] border-[#000000]'
                        : 'bg-[#FAFAFA] text-[#525252] border-[#D4D4D4] hover:border-[#000000]'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full bg-[#000000] text-[#FFFFFF] font-semibold text-sm hover:bg-[#171717] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Create My Account</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2">
          <p className="text-xs text-[#525252]">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-[#000000] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
