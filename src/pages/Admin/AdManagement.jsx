import { useState, useEffect } from 'react';
import { Search, Megaphone, MapPin, Trash2, Loader2, Eye, ShieldCheck, ShieldAlert, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { getMainImage } from '../../utils/imageHelper';

export default function AdManagement() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchAds();
  }, []);

  async function fetchAds() {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const data = await api.get('/ads', token);
      setAds(data || []);
    } catch (err) {
      console.error("Fetch ads error:", err);
    }
    setLoading(false);
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to remove this ad from the platform?')) {
      const token = localStorage.getItem('token');
      try {
        await api.delete(`/ads/${id}`, token);
        setAds(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete ad');
      }
    }
  };

  const filteredAds = Array.isArray(ads) ? ads.filter(a => 
    (a.title || '').toLowerCase().includes(search.toLowerCase()) || 
    (a.city_name || '').toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Ad Management</h1>
          <p className="text-slate-500 font-medium">Global control over all listings and visibility.</p>
        </div>
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center px-6 gap-3 min-w-[300px]">
           <Search className="text-slate-300" size={18} />
           <input 
             type="text" 
             placeholder="Filter by name or city..." 
             className="text-sm outline-none w-full py-2" 
             value={search}
             onChange={e => setSearch(e.target.value)}
           />
        </div>
      </div>

      <div className="card-premium !p-0 bg-white border border-gray-100 overflow-hidden">
         <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-gray-100">
               <tr>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Listing</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Stats</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
               {loading ? (
                 <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                       <Loader2 className="animate-spin text-primary mx-auto mb-2" size={32} />
                       <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing Ad Pool...</span>
                    </td>
                 </tr>
               ) : filteredAds.map(ad => (
                 <tr key={ad.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden">
                              <img src={getMainImage(ad.photo_url)} className="w-full h-full object-cover" alt="" />
                          </div>
                           <div>
                              <p className="font-bold text-slate-900">{ad.title}</p>
                              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Age: {ad.age || 'N/A'}</p>
                           </div>
                       </div>
                    </td>
                    <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                           <MapPin size={14} className="text-slate-300" /> {ad.city_name || 'N/A'}, {ad.state_code || ad.state_name || 'N/A'}
                        </div>
                    </td>
                    <td className="px-6 py-6">
                        <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ad.is_featured ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-500'}`}>
                           {ad.is_featured ? 'featured' : 'active'}
                        </span>
                    </td>
                    <td className="px-6 py-6">
                       <div className="flex items-center gap-4 text-slate-400">
                          <div className="flex items-center gap-1 text-xs"><Eye size={14} /> 0</div>
                          <div className="flex items-center gap-1 text-xs"><Megaphone size={14} /> Bumped</div>
                       </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                       <div className="flex justify-end gap-2">
                          <Link to={`/profile/${ad.id}`} target="_blank" className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                             <ExternalLink size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(ad.id)}
                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                 </tr>
               ))}
            </tbody>
         </table>
      </div>
    </div>
  );
}
