import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, ChevronRight, Loader2, Search } from 'lucide-react';
import { api } from '../lib/api';

export default function StateListing() {
  const { stateCode } = useParams();
  const [cities, setCities] = useState([]);
  const [stateName, setStateName] = useState('');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchStateData() {
      try {
        const allCities = await api.get('/locations/cities');
        const stateCities = allCities.filter(c => c.state_code === stateCode.toUpperCase());
        setCities(stateCities);
        if (stateCities.length > 0) {
          setStateName(stateCities[0].state_name);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchStateData();
  }, [stateCode]);

  const filteredCities = cities.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Locating cities in {stateCode}...</p>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-6xl font-black text-slate-900 mb-4">{stateName || stateCode.toUpperCase()}</h1>
          <p className="text-slate-500 text-lg font-medium">Select a city to browse local listings.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input 
            type="text" 
            placeholder="Search city..." 
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredCities.map(city => (
          <Link 
            key={city.id} 
            to={`/escorts/${city.slug}`}
            className="group p-6 bg-white border border-gray-50 rounded-[2rem] hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <MapPin size={18} />
               </div>
               <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight">{city.name}</span>
            </div>
            <ChevronRight size={16} className="text-slate-300 group-hover:text-primary transition-colors" />
          </Link>
        ))}
      </div>

      {filteredCities.length === 0 && (
        <div className="py-24 text-center">
           <p className="text-slate-400 font-medium italic">No cities found matching "{search}"</p>
        </div>
      )}
    </div>
  );
}
