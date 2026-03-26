import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, Loader2, Search, X } from 'lucide-react';
import { useCities } from '../hooks/useCities';

export default function Cities() {
  const { cities, loading, error } = useCities();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredGroupedCities = useMemo(() => {
    if (!cities.length) return {};
    
    // Low-case search query for efficient comparison
    const query = searchQuery.toLowerCase().trim();
    
    // Group and filter cities
    return cities.reduce((acc, city) => {
      const stateName = city.state_name || 'Other';
      const stateCode = city.state_code || '';
      const cityName = city.name || '';
      
      // Check if city matches search
      const matchesSearch = !query || 
        cityName.toLowerCase().includes(query) || 
        stateName.toLowerCase().includes(query) || 
        stateCode.toLowerCase().includes(query);
      
      if (matchesSearch) {
        if (!acc[stateName]) acc[stateName] = [];
        acc[stateName].push(city);
      }
      return acc;
    }, {});
  }, [cities, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-bold">Loading regions...</p>
      </div>
    );
  }

  if (error) {
     return (
       <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50">
         <div className="bg-red-50 text-red-600 p-8 rounded-3xl border border-red-100 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">Connection Error</h2>
            <p className="font-medium mb-6">We couldn't load the city directory. Please check your connection.</p>
            <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
         </div>
       </div>
     );
  }

  const hasResults = Object.keys(filteredGroupedCities).length > 0;

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Browse Cities</h1>
          <p className="text-slate-500 mt-4 text-lg">Find elite companions in major cities across the US and Canada.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="text-slate-400" size={20} />
          </div>
          <input
            type="text"
            placeholder="Search city or state..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-12 py-5 bg-white border-2 border-slate-100 rounded-[2rem] focus:outline-none focus:border-primary/30 focus:bg-white transition-all shadow-sm placeholder:text-slate-400 font-medium"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-5 flex items-center text-slate-400 hover:text-primary transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      {!hasResults ? (
        <div className="py-20 text-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <Search size={32} />
           </div>
           <h3 className="text-2xl font-bold text-slate-800">No cities found</h3>
           <p className="text-slate-500 mt-2">Try searching for a different name or browse by state.</p>
           <button 
             onClick={() => setSearchQuery('')}
             className="mt-8 text-primary font-bold hover:underline"
           >
             Clear search query
           </button>
        </div>
      ) : (
        <div className="space-y-20">
          {Object.entries(filteredGroupedCities).map(([stateName, stateCities]) => (
            <div key={stateName}>
              <div className="flex items-center gap-3 mb-10 pb-4 border-b border-gray-100">
                <MapPin className="text-primary" size={24} />
                <Link to={`/state/${stateCities[0].state_code}`} className="flex items-center gap-2 group hover:text-primary transition-colors inline-flex">
                  <h2 className="text-3xl font-bold text-slate-800 group-hover:text-primary">{stateName}</h2>
                  <span className="bg-primary/10 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{stateCities[0].state_code}</span>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {stateCities.map((city) => (
                  <Link 
                    key={city.id} 
                    to={`/escorts/${city.slug}`}
                    className="card-premium group hover:border-primary/20"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                          {city.name}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">{city.state_code}</p>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                         <MapPin size={20} />
                      </div>
                    </div>
                    <div className="mt-8 pt-6 border-t border-slate-50 flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                       View Ads
                       <span className="ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-24 bg-primary rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-primary/20">
         <h2 className="text-4xl md:text-5xl font-bold mb-6">Want to advertise in these cities?</h2>
         <p className="text-white/80 text-lg mb-10 max-w-2xl mx-auto">
           Join the fastest growing premium network of escort classifieds. Post your ad today and start getting quality leads.
         </p>
         <Link to="/register" className="bg-white text-primary px-12 py-5 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-colors inline-block">
            Get Started Now
         </Link>
      </div>
    </div>
  );
}

