import { useState, useEffect } from 'react';
import { Users, Megaphone, DollarSign, Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    activeEscorts: 0,
    liveAds: 0,
    pendingDeposits: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const users = await api.get('/admin/users', token);
      const ads = await api.get('/ads');
      const deposits = await api.get('/deposits', token);

      const escortCount = Array.isArray(users) ? users.filter(u => u.role === 'escort').length : 0;
      const adCount = Array.isArray(ads) ? ads.length : 0;
      const pendingCount = Array.isArray(deposits) ? deposits.filter(d => d.status === 'pending').length : 0;
      const revenue = Array.isArray(deposits) ? deposits
        .filter(d => d.status === 'approved')
        .reduce((sum, d) => sum + Number(d.amount || 0), 0) : 0;

      setData({
        totalRevenue: revenue,
        activeEscorts: escortCount,
        liveAds: adCount,
        pendingDeposits: pendingCount
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing platform health...</p>
      </div>
    );
  }

  const stats = [
    { title: 'Total Revenue', val: `$${data.totalRevenue}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-50', change: '+0%', up: true },
    { title: 'Active Escorts', val: data.activeEscorts, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50', change: '+0%', up: true },
    { title: 'Live Ads', val: data.liveAds, icon: Megaphone, color: 'text-purple-500', bg: 'bg-purple-50', change: '+0%', up: true },
    { title: 'Pending Deposits', val: data.pendingDeposits, icon: Wallet, color: 'text-orange-500', bg: 'bg-orange-50', change: 'NEW', up: true },
  ];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Platform Overview</h1>
          <p className="text-slate-500 font-medium">Real-time performance and system health.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="card-premium p-8 bg-white border border-gray-100">
            <div className="flex justify-between items-start mb-6">
              <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-emerald-500' : 'text-slate-400'}`}>
                {stat.change} {stat.up && <ArrowUpRight size={14} />}
              </div>
            </div>
            <div>
              <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <p className="text-3xl font-black text-slate-900">{stat.val}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <div className="card-premium p-10 bg-white h-full relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-800 mb-10 flex items-center gap-2">
              <TrendingUp size={20} className="text-primary" />
              Performance Baseline
            </h3>

            <div className="h-64 mt-12 flex items-end justify-between gap-4">
              {[40, 65, 45, 90, 85, 55, 100, 80, 70, 95, 85, 110].map((h, i) => (
                <div key={i} className="flex-grow flex flex-col items-center gap-4">
                  <div className="w-full bg-slate-100 rounded-t-xl relative group">
                    <div
                      className="bg-primary/20 rounded-t-xl transition-all duration-1000 ease-out"
                      style={{ height: `${h}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-slate-300 text-[10px] font-black uppercase tracking-[0.2em] mt-8">System Analytics Initializing...</p>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8 text-center pt-10">
          <h4 className="text-xl font-bold text-slate-900">Reach Distribution</h4>
          <div className="relative w-48 h-48 mx-auto">
            <div className="absolute inset-0 rounded-full border-[1.5rem] border-primary/20"></div>
            <div className="absolute inset-0 rounded-full border-[1.5rem] border-primary border-r-transparent border-b-transparent border-l-transparent rotate-45"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-slate-900">{data.activeEscorts}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total Escorts</span>
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-slate-50 p-6 rounded-3xl border border-gray-100">
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-2">Live Listings</p>
              <p className="text-2xl font-black text-slate-900">{data.liveAds}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
