import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, MapPin, Search, Loader2 } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { api } from '../lib/api';

export default function CityListing() {
  const { slug: citySlug } = useParams();
  const [ads, setAds] = useState([]);
  const [cityData, setCityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch ads from API based on city slug
        const data = await api.get(`/ads?city=${citySlug}`);
        
        // The API returns the city_name. Use the first ad's city_name if available
        if (data.length > 0) {
          setCityData({ name: data[0].city_name, state: data[0].state_name });
        } else {
          // Fallback if no ads, we might need a separate endpoint to get city details by slug
          // For now, derive from slug
          const parts = citySlug.split('-');
          const stateCode = parts.pop().toUpperCase();
          const cityName = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
          setCityData({ name: cityName, state: stateCode });
        }
        
        // Sort featured ads to the top
        const sortedAds = (data || []).sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return 0;
        });
        
        setAds(sortedAds);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [citySlug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-bold">Finding companions in {citySlug.replace('-', ' ')}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin size={32} className="text-slate-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-800 mb-4">Location Not Found</h2>
          <p className="text-slate-500 mb-8 font-medium">We couldn't find any premium services in "{citySlug.replace('-', ' ')}" yet.</p>
          <Link to="/cities" className="btn-primary">Browse All Cities</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 bg-accent-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Breadcrumbs & Title */}
        <div className="mb-12">
          <div className="flex items-center text-slate-400 text-sm gap-2 mb-4">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link to="/cities" className="hover:text-primary transition-colors">Cities</Link>
            <span>/</span>
            <span className="text-slate-600 font-bold">{cityData?.name}</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Escorts in <span className="text-primary">{cityData?.name}</span>
          </h1>
          <p className="text-slate-500 mt-2">Showing {ads.length} verified listings in {cityData?.state}.</p>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-10 flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 text-slate-600 font-semibold hover:text-primary transition-colors px-4 py-2 rounded-xl bg-slate-50">
                 <Filter size={18} />
                 Filters
              </button>
              <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
                 <span>Sort by:</span>
                 <button className="text-primary font-bold flex items-center gap-1">
                    Recently Bumped <ChevronDown size={14} />
                 </button>
              </div>
           </div>
           
           <div className="relative flex-grow md:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" 
                placeholder={`Search in ${cityData?.name}...`} 
                className="w-full bg-slate-50 border-none rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/10 text-slate-600"
              />
           </div>
        </div>

        {/* Listings Grid */}
        {ads.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {ads.map(ad => (
              <ListingCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <Search size={32} />
             </div>
             <h3 className="text-2xl font-bold text-slate-800">No active ads right now</h3>
             <p className="text-slate-400 mt-2 font-medium">Be the first to post a listing in {cityData?.name}!</p>
             <Link to="/dashboard/post-ad" className="btn-primary mt-8">Post An Ad Now</Link>
          </div>
        )}
        
        {/* Pagination shown only if ads > 12 */}
        {ads.length > 12 && (
          <div className="mt-20 flex justify-center">
             <div className="flex items-center gap-2">
                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-bold text-primary shadow-sm">1</button>
                <button className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center font-bold text-slate-400 hover:border-primary/20 transition-all">Next</button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
