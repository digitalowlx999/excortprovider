import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, PlusCircle, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-lg z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-primary">
              Escort<span className="text-slate-900">Provider</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-slate-600 hover:text-primary transition-colors font-medium">Home</Link>
            <Link to="/cities" className="text-slate-600 hover:text-primary transition-colors font-medium">Cities</Link>
            
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="text-slate-600 hover:text-primary transition-colors font-medium">Login</Link>
                <Link to="/register" className="btn-primary flex items-center gap-2 py-2 px-5">
                  <User size={18} />
                  Register
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link to="/dashboard" className="text-slate-600 font-bold flex items-center gap-2 hover:text-primary transition-all">
                  <LayoutDashboard size={20} />
                  Dashboard
                </Link>
                <Link to="/dashboard/wallet" className="text-primary font-bold flex items-center gap-2 hover:bg-primary/5 px-4 py-2 rounded-xl transition-all">
                  <PlusCircle size={20} />
                  Deposit
                </Link>
              </div>
            )}

            <Link to="/dashboard/post-ad" className="btn-secondary flex items-center gap-2 py-2 px-5">
              <PlusCircle size={18} />
              Post Ad
            </Link>
          </div>

          <div className="md:hidden">
            <button className="p-2 text-slate-600">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
