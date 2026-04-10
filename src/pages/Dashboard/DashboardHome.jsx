import { useState, useEffect } from 'react';
import { Megaphone, TrendingUp, Wallet, ArrowUpRight, Loader2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { getMainImage, FALLBACK_IMAGE } from '../../utils/imageHelper';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    activeAds: 0,
    balance: 0,
    bumpPoints: 0
  });
  const [recentAds, setRecentAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAlias, setUserAlias] = useState('');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        // 1. Fetch profile
        const profile = await api.get('/auth/profile', token);
        setUserAlias(profile?.alias || profile?.email?.split('@')[0]);

        // 2. Fetch user's ads
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserRole(user.role);
        
        const allAds = await api.get('/ads');
        const myAds = Array.isArray(allAds) ? allAds.filter(a => a.user_id === user.id) : [];
        
        setStats({
          activeAds: myAds.length,
          balance: profile?.wallet_balance || 0,
          bumpPoints: 0
        });
        setRecentAds(Array.isArray(myAds) ? myAds.slice(0, 3) : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Gathering your stats...</p>
      </div>
    );
  }

  const statCards = userRole === 'viewer'
    ? []
    : [
        { title: 'Active Ads', val: stats.activeAds || 0, icon: Megaphone, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Wallet Bal', val: `$${Number(stats.balance || 0).toFixed(2)}`, icon: Wallet, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: 'Bump Points', val: stats.bumpPoints, icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
      ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2 capitalize text-pink-600">Morning, {userAlias}!</h1>
        <p className="text-slate-500 font-medium">
          {userRole === 'viewer' 
            ? "Welcome back to the premium community." 
            : "Here's what's happening with your listings today."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {statCards.map((stat, idx) => (
          <div key={idx} className="card-premium p-8 bg-white border border-gray-100 flex flex-col justify-between">
             <div className="flex justify-between items-start mb-6">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                   <stat.icon size={24} />
                </div>
             </div>
             <div>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-slate-900">{stat.val}</p>
             </div>
          </div>
        ))}
      </div>

      <div className={`grid grid-cols-1 ${userRole === 'viewer' ? 'lg:grid-cols-1' : 'lg:grid-cols-12'} gap-10`}>
         {userRole === 'viewer' ? (
           <div className="card-premium p-12 bg-white text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-8">
                 <Shield size={40} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4">Start Exploring</h3>
              <p className="text-slate-500 max-w-lg mx-auto mb-10 font-medium leading-relaxed">
                 You are currently in **Visitor Mode**. Browse through thousands of verified elite performers across major cities in the US and Canada.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <Link to="/cities" className="btn-primary !px-10 !py-4 shadow-xl shadow-primary/20">
                    Explore Cities
                 </Link>
                 <Link to="/dashboard/settings" className="px-10 py-4 bg-slate-50 text-slate-600 rounded-2xl font-bold hover:bg-slate-100 transition-all">
                    Account Settings
                 </Link>
              </div>
           </div>
         ) : (
           <>
             <div className="lg:col-span-8 flex flex-col gap-6">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                   Recent Listings
                   <Link to="/dashboard/ads" className="text-primary text-sm font-bold hover:underline">View All</Link>
                </h3>
                
                <div className="space-y-4">
                   {recentAds.map((ad, idx) => (
                     <Link key={idx} to={`/profile/${ad.id}`} className="card-premium !p-4 bg-white flex items-center justify-between hover:border-primary/20 transition-all">
                        <div className="flex items-center gap-4">
                       <img src={getMainImage(ad.photo_url)} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} className="w-16 h-16 rounded-2xl object-cover" alt="" />
                           <div>
                              <p className="font-bold text-slate-900">{ad.title}</p>
                              <p className="text-slate-400 text-xs font-medium">{ad.city_name || 'N/A'}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-6">
                           <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ad.is_featured ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                               {ad.is_featured ? 'featured' : 'active'}
                           </span>
                           <ArrowUpRight size={20} className="text-slate-400" />
                        </div>
                     </Link>
                   ))}
                   
                   {recentAds.length === 0 && (
                     <div className="border-2 border-dashed border-gray-100 rounded-[2.5rem] p-12 text-center text-slate-400 font-medium">
                        You haven't posted any ads yet. 
                        <Link to="/dashboard/post-ad" className="text-primary font-bold ml-1 hover:underline">Start now</Link>
                     </div>
                   )}
                </div>
             </div>
    
             <div className="lg:col-span-4">
                <div className="bg-primary rounded-[3rem] p-10 text-white shadow-2xl shadow-primary/20 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <TrendingUp size={120} />
                   </div>
                   <h4 className="text-2xl font-bold mb-4 relative z-10">Boost Your Reach</h4>
                   <p className="text-white/80 text-sm leading-relaxed mb-8 relative z-10">
                     Ads with the "Featured" badge stand out more and attract more clients. Upgrade your listing now!
                   </p>
                   <Link to="/dashboard/ads" className="bg-white text-primary px-8 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-colors shadow-xl inline-block">
                      Bump My Ads
                   </Link>
                </div>
    
                <div className="mt-8 card-premium p-8 bg-white">
                   <h4 className="font-bold text-slate-900 mb-6 border-b border-gray-50 pb-4">Wallet Info</h4>
                   <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-400 font-medium">Available Bal</span>
                         <span className="text-slate-900 font-bold">${Number(stats.balance || 0).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                         <span className="text-slate-400 font-medium">Min. Posting</span>
                         <span className="text-slate-900 font-bold text-primary">$10.00</span>
                      </div>
                      <Link to="/dashboard/wallet" className="btn-secondary w-full text-center inline-block mt-4 !py-3 !text-xs font-bold uppercase tracking-widest">Manage Wallet</Link>
                   </div>
                </div>
             </div>
           </>
         )}
      </div>
    </div>
  );
}
