import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Leaf, LayoutDashboard, LogIn, LogOut, UserCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount, currentUser, logout } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path ? "text-tea-700 font-bold" : "text-stone-600 hover:text-tea-600";

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-paper/90 backdrop-blur-md border-b border-tea-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2">
              <Leaf className="h-8 w-8 text-tea-600" />
              <span className="font-serif text-2xl font-bold text-tea-800 hidden sm:block">Serenity Brews</span>
              <span className="font-serif text-2xl font-bold text-tea-800 sm:hidden">SB</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/shop" className={isActive('/shop')}>Shop</Link>
            
            {currentUser?.role === 'admin' && (
              <Link to="/admin" className={`flex items-center gap-1 ${isActive('/admin')}`}>
                <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
              </Link>
            )}

            <Link to="/cart" className="relative p-2 text-tea-800 hover:bg-tea-100 rounded-full transition-colors">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                <Link to="/profile" className="flex items-center gap-2 text-sm text-tea-800 font-medium hover:text-tea-600 transition-colors">
                  <UserCircle className="w-5 h-5" />
                  <span>{currentUser.name}</span>
                </Link>
                <button onClick={handleLogout} className="text-stone-500 hover:text-red-600 transition-colors" title="Logout">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 pl-4 border-l border-stone-200">
                <Link to="/login" className="text-sm font-medium text-tea-700 hover:text-tea-900">Login</Link>
                <Link to="/register" className="text-sm px-4 py-2 rounded-full bg-tea-600 text-white hover:bg-tea-700 font-medium transition-colors">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <Link to="/cart" className="mr-4 relative p-2 text-tea-800">
              <ShoppingBag className="h-6 w-6" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-tea-800 hover:text-tea-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-tea-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-tea-700 hover:bg-tea-50">Home</Link>
            <Link to="/shop" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-tea-700 hover:bg-tea-50">Shop</Link>
            
            {currentUser?.role === 'admin' && (
              <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-tea-700 bg-tea-50">Admin Dashboard</Link>
            )}

            <div className="border-t border-stone-100 mt-2 pt-2">
              {currentUser ? (
                <>
                  <Link to="/profile" onClick={() => setIsOpen(false)} className="px-3 py-2 text-tea-800 font-bold flex items-center gap-2 hover:bg-tea-50 rounded-md">
                     <UserCircle className="w-5 h-5" /> {currentUser.name}
                  </Link>
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md font-medium">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-stone-700 hover:bg-stone-50">Login</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-tea-700 font-bold hover:bg-tea-50">Register</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;