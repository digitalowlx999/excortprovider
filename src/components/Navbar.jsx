import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, PlusCircle, LayoutDashboard, Home as HomeIcon, MapPin, Plus } from 'lucide-react';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 top-20 bg-white z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 space-y-8 h-full overflow-y-auto bg-white">
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Main Navigation</p>
            <div className="grid grid-cols-1 gap-2">
               <Link 
                 to="/" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100 font-bold text-slate-700 active:scale-95 transition-all"
               >
                  <HomeIcon size={20} className="text-primary" /> Home
               </Link>
               <Link 
                 to="/cities" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100 font-bold text-slate-700 active:scale-95 transition-all"
               >
                  <MapPin size={20} className="text-primary" /> Cities
               </Link>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Account & Actions</p>
            <div className="grid grid-cols-1 gap-2">
               {!isLoggedIn ? (
                 <>
                   <Link 
                     to="/login" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <User size={20} className="text-slate-400" /> Login
                   </Link>
                   <Link 
                     to="/register" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-4 p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 font-bold active:scale-95 transition-all"
                   >
                      <Plus size={20} /> Join the Community
                   </Link>
                 </>
               ) : (
                 <>
                   <Link 
                     to="/dashboard" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <LayoutDashboard size={20} className="text-primary" /> Dashboard
                   </Link>
                   <Link 
                     to="/dashboard/wallet" 
                     onClick={() => setIsMenuOpen(false)}
                     className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-gray-100 font-bold text-slate-700 active:scale-95 transition-all"
                   >
                      <PlusCircle size={20} className="text-emerald-500" /> Wallet / Deposit
                   </Link>
                 </>
               )}
               <Link 
                 to="/dashboard/post-ad" 
                 onClick={() => setIsMenuOpen(false)}
                 className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-xl font-bold mt-4 active:scale-95 transition-all"
               >
                  <PlusCircle size={20} /> Post New Ad
               </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
