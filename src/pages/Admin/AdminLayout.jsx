import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Megaphone, CheckSquare, Settings, LogOut, ShieldCheck, Bell, Menu, MapPin } from 'lucide-react';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!token || user.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const menuItems = [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin' },
    { title: 'Create Ad', icon: PlusCircle, path: '/dashboard/post-ad' },
    { title: 'Users', icon: Users, path: '/admin/users' },
    { title: 'Regions', icon: MapPin, path: '/admin/regions' },
    { title: 'Ads', icon: Megaphone, path: '/admin/ads' },
    { title: 'Deposits', icon: CheckSquare, path: '/admin/deposits' },
    { title: 'Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 z-50 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
         <div className="p-8">
            <Link to="/" className="text-2xl font-black text-primary tracking-tighter block mb-12">
               Admin<span className="text-white">Panel</span>
            </Link>

            <nav className="space-y-2">
               {menuItems.map((item) => (
                 <Link
                   key={item.path}
                   to={item.path}
                   className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                   onClick={() => setSidebarOpen(false)}
                 >
                   <item.icon size={22} />
                   {item.title}
                 </Link>
               ))}
            </nav>
         </div>

         <div className="absolute bottom-8 left-8 right-8">
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800 py-4 rounded-2xl font-bold text-slate-400 hover:text-white transition-all text-sm">
               <LogOut size={18} />
               Sign Out
            </button>
         </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow flex flex-col min-w-0 bg-slate-50">
         {/* Top bar */}
         <header className="h-24 bg-white border-b border-gray-100 sticky top-0 z-30 px-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <button className="lg:hidden p-2 bg-slate-50 rounded-xl" onClick={() => setSidebarOpen(true)}>
                  <Menu size={24} />
               </button>
               <div className="flex items-center gap-2">
                  <ShieldCheck className="text-primary" size={24} />
                  <h2 className="text-xl font-bold text-slate-800">
                     System Administration
                  </h2>
               </div>
            </div>

            <div className="flex items-center gap-6">
               <button className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-primary transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full ring-4 ring-white"></span>
               </button>
               <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold uppercase">
                  {JSON.parse(localStorage.getItem('user') || '{}').alias?.[0] || 'A'}
               </div>
            </div>
         </header>

         {/* View content */}
         <main className="p-8 lg:p-12 overflow-y-auto flex-grow">
            <div className="max-w-6xl">
               <Outlet />
            </div>
         </main>
      </div>
    </div>
  );
}
