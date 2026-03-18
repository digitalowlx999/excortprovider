import { useState, useEffect } from 'react';
import { Megaphone, PlusCircle, Eye, Clock, Edit, Trash2, ArrowUpCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import { getMainImage } from '../../utils/imageHelper';

export default function MyAds() {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyAds();
  }, []);

  async function fetchMyAds() {
    setLoading(true);
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      const allAds = await api.get('/ads');
      // Filter by user ID
      setAds(Array.isArray(allAds) ? allAds.filter(a => a.user_id === user.id) : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this ad?')) {
      const token = localStorage.getItem('token');
      try {
        await api.delete(`/ads/${id}`, token);
        setAds(prev => prev.filter(a => a.id !== id));
      } catch (err) {
        alert(err.message || 'Failed to delete ad');
      }
    }
  };

  const handleBump = async (id) => {
    if (confirm('Bumping this ad will cost $5. Continue?')) {
      const token = localStorage.getItem('token');
      try {
        await api.put(`/ads/${id}/bump`, {}, token);
        alert('Ad successfully bumped to the top!');
        fetchMyAds();
      } catch (err) {
        alert(err.message || 'Failed to bump ad');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Syncing your listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">My Ads</h1>
          <p className="text-slate-500 font-medium">Manage and bump your current listings.</p>
        </div>
        <Link to="/dashboard/post-ad" className="btn-primary !py-4 !px-8 flex items-center gap-2 shadow-2xl shadow-primary/30">
           <PlusCircle size={20} />
           Create New Ad
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8">
         {ads.map(ad => (
           <div key={ad.id} className="card-premium !p-6 bg-white flex flex-col lg:flex-row items-center gap-8">
              <div className="w-full lg:w-48 h-48 rounded-[2rem] overflow-hidden flex-shrink-0 shadow-lg bg-slate-100">
                 <img 
                    src={getMainImage(ad.photo_url)} 
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-100 shadow-sm" 
                    alt={ad.title} 
                 />
              </div>
              
              <div className="flex-grow space-y-4">
                 <div className="flex items-center gap-4">
                    <h3 className="text-2xl font-bold text-slate-900">{ad.title}</h3>
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${ad.is_featured ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'}`}>
                       {ad.is_featured ? 'featured' : 'active'}
                    </span>
                 </div>
                 
                 <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400 font-medium">
                       <Eye size={16} /> 0 views
                    </div>
                     <div className="flex items-center gap-2 text-slate-400 font-medium font-bold italic">
                        {ad.city_name}, {ad.state_code}
                     </div>
                    <div className="flex items-center gap-2 text-primary font-bold">
                       <ArrowUpCircle size={16} /> Standard Listing
                    </div>
                 </div>

                 <div className="pt-4 flex flex-wrap gap-3">
                    <button 
                      onClick={() => handleBump(ad.id)}
                      className="btn-primary !py-2 !px-6 !text-xs flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                    >
                       <ArrowUpCircle size={14} /> Bump Ad ($5)
                    </button>
                    <button className="btn-secondary !py-2 !px-6 !text-xs flex items-center gap-2">
                       <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(ad.id)}
                      className="btn-secondary !py-2 !px-6 !text-xs flex items-center gap-2 !text-red-500 !border-red-100 hover:!bg-red-50"
                    >
                       <Trash2 size={14} /> Delete
                    </button>
                 </div>
              </div>
           </div>
         ))}
      </div>

      {ads.length === 0 && (
        <div className="bg-white border-2 border-dashed border-gray-100 rounded-[3rem] p-24 text-center">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mx-auto mb-6">
              <Megaphone size={40} />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">No active ads yet</h3>
           <p className="text-slate-400 max-w-sm mx-auto mb-10 leading-relaxed italic">
             You haven't posted any listings yet. Reach 10k+ clients in your city today!
           </p>
           <Link to="/dashboard/post-ad" className="btn-primary py-4 px-12 inline-block">Post Your First Ad</Link>
        </div>
      )}
    </div>
  );
}
