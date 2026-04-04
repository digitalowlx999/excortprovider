import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Megaphone, Wallet, Settings, LogOut, Bell, Menu, PlusCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTop = 0;
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (!token || !storedUser) {
      navigate('/login');
    } else {
      let parsedUser = {};
      try {
        parsedUser = JSON.parse(storedUser);
      } catch (e) {
        console.error("Failed to parse stored user:", e);
        navigate('/login');
        return;
      }
      setUser(parsedUser);
      
      // Initial fetch
      fetchProfile(token, parsedUser);

      // Set up polling for balance every 60 seconds
      const interval = setInterval(() => {
        fetchProfile(token, parsedUser);
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [navigate]);

  async function fetchProfile(token, fallbackUser) {
    try {
      const profile = await api.get('/auth/profile', token);
      setUser(prev => {
        const currentUser = prev || fallbackUser;
        const updatedUser = { ...currentUser, wallet_balance: profile.wallet_balance };
        // Sync back to local storage so other parts of the app have the fresh balance
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, path: '/dashboard' },
    ...(user?.role !== 'viewer' ? [{ title: 'My Ads', icon: Megaphone, path: '/dashboard/ads' }] : []),
    { title: 'Wallet', icon: Wallet, path: '/dashboard/wallet' },
    { title: 'Settings', icon: Settings, path: '/dashboard/settings' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({ title: 'Admin Panel', icon: ShieldCheck, path: '/admin' });
  }

  if (!user) return (
    <div className="h-screen flex items-center justify-center bg-accent-light">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-accent-light flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 flex flex-col lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
            <Link to="/" className="text-2xl font-black text-primary tracking-tighter block mb-12">
               Escort<span className="text-slate-900">Provider</span>
            </Link>

            <nav className="space-y-2">
               {menuItems.map((item) => (
                 <Link
                   key={item.path}
                   to={item.path}
                   className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}`}
                   onClick={() => setSidebarOpen(false)}
                 >
                   <item.icon size={22} />
                   {item.title}
                 </Link>
               ))}
            </nav>
         </div>

         <div className="mt-auto p-8 border-t border-gray-50 bg-slate-50">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {(user.alias || user.email)?.[0]?.toUpperCase()}
               </div>
               <div className="overflow-hidden">
                  <p className="text-slate-900 font-bold truncate text-sm">{user.alias || user.email?.split('@')[0]}</p>
                <p className="text-slate-400 text-xs truncate">{user.email}</p>
               </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 py-3 rounded-xl font-bold text-slate-600 hover:text-red-500 hover:border-red-100 transition-all text-sm"
            >
               <LogOut size={18} />
               Log Out
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0">
         {/* Top bar */}
         <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <button className="lg:hidden p-2 bg-slate-50 rounded-xl" onClick={() => setSidebarOpen(true)}>
                  <Menu size={24} />
               </button>
               <h2 className="text-lg font-bold text-slate-800 hidden sm:block">
                  {menuItems.find(m => m.path === location.pathname)?.title || 'Dashboard'}
               </h2>
            </div>

            <div className="flex items-center gap-3">
               <div className="hidden md:flex flex-col items-end mr-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wallet Balance</span>
                  <span className="text-primary font-black text-lg">${Number(user?.wallet_balance || 0).toFixed(2)}</span>
               </div>
               <button className="p-2.5 bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
               </button>
               {user?.role !== 'viewer' && (
                 <Link to="/dashboard/post-ad" className="btn-primary flex items-center gap-2 !py-2.5 !px-4 text-sm whitespace-nowrap">
                    <PlusCircle size={18} />
                    Post New Ad
                 </Link>
               )}
            </div>
         </header>

         {/* View content */}
         <main ref={mainRef} className="p-4 md:p-8 lg:p-12 overflow-y-auto bg-slate-50/50 flex-grow">
            <div className="max-w-6xl">
               <Outlet />
            </div>
         </main>
      </div>
    </div>
  );
}
