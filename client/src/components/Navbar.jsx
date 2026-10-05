import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Shirt,
  Palette,
  MessageSquare,
  Layers,
  Search,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  ShoppingBag
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Shop', path: '/shop', icon: ShoppingBag },
    { name: 'Virtual Try-On', path: '/try-on', icon: Sparkles, highlight: true },
    { name: 'AI Stylist', path: '/consultation', icon: MessageSquare },
    { name: 'Color Analysis', path: '/color-analysis', icon: Palette },
    { name: 'Wardrobe', path: '/wardrobe', icon: Shirt },
    { name: 'Studio', path: '/studio', icon: Layers },
    { name: 'Inspo Match', path: '/analyzer', icon: Search },
    { name: 'Membership', path: '/pricing' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-serif text-3xl font-light tracking-[0.25em] text-black uppercase">
            MAISON
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs uppercase tracking-widest font-medium transition-all ${
                  isActive
                    ? 'bg-black text-white'
                    : link.highlight
                    ? 'border border-black text-black hover:bg-black hover:text-white'
                    : 'text-neutral-600 hover:text-black hover:bg-neutral-100'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Auth Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 border border-neutral-200 hover:border-black transition-colors text-xs uppercase tracking-wider font-medium text-black"
              >
                <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center text-[10px] font-semibold text-white">
                  {user?.name?.[0] || 'M'}
                </div>
                <span>{user?.name?.split(' ')[0] || 'Atelier'}</span>
                <span className="px-1.5 py-0.5 text-[9px] uppercase font-bold tracking-wider bg-neutral-100 text-black">
                  {user?.plan || 'Member'}
                </span>
                <ChevronDown className="w-3 h-3 text-neutral-500" />
              </button>

              {userDropdownOpen && (
                <div
                  onMouseLeave={() => setUserDropdownOpen(false)}
                  className="absolute right-0 mt-2 w-56 bg-white border border-neutral-200 py-2 z-50 shadow-xl animate-fadeIn"
                >
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-[10px] uppercase tracking-wider text-neutral-400">Signed in as</p>
                    <p className="text-xs font-semibold text-black truncate">{user?.email}</p>
                    <p className="text-[11px] text-neutral-600 mt-0.5">
                      Season: <span className="font-semibold text-black">{user?.activeColorSeason || 'Deep Autumn'}</span>
                    </p>
                  </div>

                  <Link
                    to="/wardrobe"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black"
                  >
                    <Shirt className="w-3.5 h-3.5" />
                    Digital Wardrobe
                  </Link>
                  <Link
                    to="/try-on"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Virtual Fitting Room
                  </Link>
                  <Link
                    to="/pricing"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:bg-neutral-50 hover:text-black"
                  >
                    <User className="w-3.5 h-3.5" />
                    Atelier Membership
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-wider text-red-600 hover:bg-neutral-50 border-t border-neutral-100 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 text-xs uppercase tracking-widest font-medium text-neutral-600 hover:text-black"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 text-xs uppercase tracking-widest font-semibold bg-black text-white hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Atelier Access
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="xl:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-black hover:text-neutral-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-neutral-200 bg-white px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-xs uppercase tracking-widest font-medium text-black hover:bg-neutral-50"
              >
                {Icon && <Icon className="w-4 h-4 text-black" />}
                {link.name}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-neutral-200 flex flex-col gap-2">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs uppercase tracking-wider font-semibold"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user?.name})
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 border border-black text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2.5 bg-black text-white text-xs uppercase tracking-widest font-semibold"
                >
                  Atelier Access
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
