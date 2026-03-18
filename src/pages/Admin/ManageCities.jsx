import { useState, useEffect } from 'react';
import { Plus, Search, MapPin, Trash2, Globe, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function ManageCities() {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCity, setNewCity] = useState({ name: '', state: '', country: 'United States' });
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCities();
  }, []);

  async function fetchCities() {
    setLoading(true);
    try {
      const data = await api.get('/locations/cities');
      setCities(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  const handleAddCity = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await api.post('/admin/cities', { 
        name: newCity.name, 
        state_code: newCity.state.toUpperCase() 
      }, token);
      setNewCity({ name: '', state: '', country: 'United States' });
      fetchCities();
    } catch (err) {
      alert(err.message || 'Failed to add city');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to remove this city? Existing ads will be disconnected.')) return;
    
    const token = localStorage.getItem('token');
    try {
      await api.delete(`/admin/cities/${id}`, token);
      setCities(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      alert(err.message || 'Failed to delete city');
    }
  };

  const filteredCities = Array.isArray(cities) ? cities.filter(city => 
    (city.name || '').toLowerCase().includes(search.toLowerCase()) || 
    (city.state_code || city.state_name || '').toLowerCase().includes(search.toLowerCase())
  ) : [];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Regional Management</h1>
        <p className="text-slate-500 font-medium">Add or remove cities served in the USA and Canada.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Add New City */}
        <div className="lg:col-span-4">
           <div className="card-premium p-8 sticky top-32">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                 <Plus className="text-primary" size={20} />
                 Add New Region
              </h3>
              <form onSubmit={handleAddCity} className="space-y-5">
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">City Name</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. San Diego" 
                      required
                      value={newCity.name}
                      onChange={e => setNewCity({...newCity, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">State / Province Code</label>
                    <input 
                      type="text" 
                      className="input-field" 
                      placeholder="e.g. CA" 
                      required
                      value={newCity.state}
                      onChange={e => setNewCity({...newCity, state: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Country</label>
                    <select 
                      className="input-field appearance-none cursor-pointer"
                      value={newCity.country}
                      onChange={e => setNewCity({...newCity, country: e.target.value})}
                    >
                       <option>United States</option>
                       <option>Canada</option>
                    </select>
                 </div>
                 <button type="submit" className="btn-primary w-full !py-4 mt-4 shadow-lg shadow-primary/20">
                    Add Region
                 </button>
              </form>
           </div>
        </div>

        {/* Right: City List */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex items-center px-6 gap-3">
              <Search className="text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder="Search regions..." 
                className="text-sm outline-none w-full py-2" 
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
           </div>

           <div className="card-premium !p-0 bg-white border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                 <thead className="bg-slate-50/50 border-b border-gray-100">
                    <tr>
                       <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Location</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Country</th>
                       <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50">
                    {loading ? (
                      <tr>
                        <td colSpan="3" className="px-8 py-20 text-center">
                           <Loader2 className="animate-spin text-primary mx-auto mb-2" size={24} />
                           <span className="text-slate-400 text-sm font-medium">Syncing database...</span>
                        </td>
                      </tr>
                    ) : filteredCities.map(city => (
                      <tr key={city.id} className="hover:bg-slate-50/50 transition-colors">
                         <td className="px-8 py-6">
                            <div className="flex items-center gap-3">
                               <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-slate-400">
                                  <MapPin size={16} />
                               </div>
                               <div>
                                  <p className="font-bold text-slate-900">{city.name}</p>
                                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{city.state_code}</p>
                               </div>
                            </div>
                         </td>
                         <td className="px-6 py-6">
                            <div className="flex items-center gap-2">
                               <Globe size={14} className="text-slate-300" />
                               <span className="text-sm font-semibold text-slate-600">{city.country}</span>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-right">
                            <button 
                             onClick={() => handleDelete(city.id)}
                              className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                               <Trash2 size={18} />
                            </button>
                         </td>
                       </tr>
                     ))}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
}
