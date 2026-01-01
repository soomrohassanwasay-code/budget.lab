
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User as UserIcon, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-50 h-24">
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between relative">
        
        {/* Left Nav */}
        <nav className="flex items-center space-x-10">
          <Link 
            to="/" 
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
              isActive('/') 
                ? 'bg-[#b195f9] text-white shadow-md' 
                : 'text-gray-500 hover:text-[#b195f9]'
            }`}
          >
            Home
          </Link>
          <Link 
            to="/contact" 
            className={`text-sm font-semibold transition-colors duration-200 ${
              isActive('/contact') 
                ? 'text-[#b195f9]' 
                : 'text-gray-500 hover:text-[#b195f9]'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Centered Logo - BUDGET LAB */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link to="/" className="flex flex-col items-center leading-none">
            <div className="flex flex-col items-center select-none">
              <span className="text-xl font-[900] tracking-tight text-black">BUDGET</span>
              <span className="text-xl font-[900] tracking-[0.15em] text-black">LAB</span>
            </div>
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center" ref={dropdownRef}>
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center group p-0.5 rounded-full hover:bg-gray-50 transition-all border-2 border-transparent hover:border-brand/20"
              >
                <div className="w-10 h-10 rounded-full bg-brand/10 overflow-hidden flex items-center justify-center text-brand font-black text-sm uppercase transition-transform duration-300">
                  {user.avatar && user.avatar.trim() !== '' ? (
                    <img 
                      key={user.avatar} // Force update on source change
                      src={user.avatar} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initial if URL fails
                        (e.target as HTMLImageElement).style.display = 'none';
                        const parent = (e.target as HTMLImageElement).parentElement;
                        if (parent) parent.innerText = user.name.charAt(0);
                      }}
                    />
                  ) : (
                    user.name.charAt(0)
                  )}
                </div>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 py-3 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-5 py-3 border-b border-gray-50 mb-2">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-0.5">Signed in as</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                  </div>
                  
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={() => setShowDropdown(false)}
                    className={`flex items-center space-x-3 px-5 py-3 text-sm font-bold transition-all ${
                      location.pathname === '/dashboard' || location.pathname === '/admin'
                        ? 'text-brand bg-brand/5'
                        : 'text-gray-600 hover:text-brand hover:bg-brand/5'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard</span>
                  </Link>

                  <Link 
                    to="/dashboard/settings" 
                    onClick={() => setShowDropdown(false)}
                    className={`flex items-center space-x-3 px-5 py-3 text-sm font-bold transition-all ${
                      location.pathname === '/dashboard/settings'
                        ? 'text-brand bg-brand/5'
                        : 'text-gray-600 hover:text-brand hover:bg-brand/5'
                    }`}
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>

                  <div className="mt-2 pt-2 border-t border-gray-50">
                    <button 
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 px-5 py-3 text-sm font-bold text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              to="/login"
              className="p-2 text-gray-700 hover:text-[#b195f9] transition-colors duration-200"
              aria-label="Sign in"
            >
              <UserIcon className="w-6 h-6 stroke-[1.5px]" />
            </Link>
          )}
        </div>

      </div>
    </header>
  );
};
