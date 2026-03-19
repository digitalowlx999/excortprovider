import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, PlusCircle, LayoutDashboard, Home as HomeIcon, MapPin, Plus, LogOut } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setIsMenuOpen(false); // Close menu on route change
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
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-600 hover:text-primary transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - Full Screen Compressed */}
      <div 
        className={`md:hidden fixed inset-0 bg-white z-[9999] transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Compact Header */}
        <div className="flex justify-between items-center h-16 px-4 border-b border-gray-50">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-xl font-black tracking-tighter text-primary">
            Escort<span className="text-slate-900">Provider</span>
          </Link>
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 text-slate-400 hover:text-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6 h-[calc(100vh-4rem)] overflow-y-auto bg-white">
          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Navigation</p>
            <div className="grid grid-cols-2 gap-2">
               <Link 
                 to="/" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-gray-50 font-bold text-slate-700 active:scale-95 transition-all"
               >
                  <HomeIcon size={20} className="text-primary" /> 
                  <span className="text-xs">Home</span>
               </Link>
               <Link 
                 to="/cities" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex flex-col items-center justify-center gap-2 p-4 bg-slate-50 rounded-2xl border border-gray-50 font-bold text-slate-700 active:scale-95 transition-all"
               >
                  <MapPin size={20} className="text-primary" />
                  <span className="text-xs">Cities</span>
               </Link>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-300 ml-2">Account</p>
            <div className="grid grid-cols-1 gap-2">
               {!isLoggedIn ? (
                 <>
                   <Link 
                     to="/login" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-50 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <User size={18} className="text-slate-400" />
                      <span className="text-sm">Sign In</span>
                   </Link>
                   <Link 
                     to="/register" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-3 p-3 bg-primary text-white rounded-xl shadow-md shadow-primary/10 font-bold active:scale-95 transition-all"
                   >
                      <Plus size={18} />
                      <span className="text-sm">Join the Community</span>
                   </Link>
                 </>
               ) : (
                 <>
                   <Link 
                     to="/dashboard" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-50 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <LayoutDashboard size={18} className="text-primary" />
                      <span className="text-sm">My Dashboard</span>
                   </Link>
                   <Link 
                     to="/dashboard/wallet" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-gray-50 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <PlusCircle size={18} className="text-emerald-500" />
                       <span className="text-sm">Wallet & Deposits</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 p-3 bg-red-50 text-red-600 rounded-xl border border-red-100 font-bold active:scale-95 transition-all"
                    >
                       <LogOut size={18} />
                       <span className="text-sm">Logout</span>
                    </button>
                 </>
               )}
            </div>
          </div>

          <div className="pt-2">
            <Link 
              to="/dashboard/post-ad" 
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center gap-2 p-4 bg-slate-900 text-white rounded-2xl shadow-lg font-bold active:scale-95 transition-all w-full"
            >
               <PlusCircle size={20} />
               <span className="text-base">Post Your Ad Now</span>
            </Link>
          </div>
          
          <div className="pt-4 text-center">
             <p className="text-slate-300 text-[9px] font-bold uppercase tracking-tighter">Premium Classifieds Platform</p>
          </div>
        </div>
      </div>
    </nav>
  );
}
