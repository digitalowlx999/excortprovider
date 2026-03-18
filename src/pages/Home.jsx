import { useState, useEffect } from 'react';
import { Search, MapPin, Shield, Zap, TrendingUp, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCities } from '../hooks/useCities';
import { api } from '../lib/api';
import { getMainImage } from '../utils/imageHelper';

export default function Home() {
  const { cities, loading: citiesLoading } = useCities();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [featuredAds, setFeaturedAds] = useState([]);
  const [loadingAds, setLoadingAds] = useState(true);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const data = await api.get('/ads?featured=true');
        setFeaturedAds(data.slice(0, 3));
      } catch (err) {
        console.error("Failed to fetch ads", err);
      } finally {
        setLoadingAds(false);
      }
    }
    fetchFeatured();
  }, []);

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  const handleSearch = (citySlug) => {
    if (citySlug) {
      navigate(`/escorts/${citySlug}`);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-slate-900 overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&q=80&w=1920" className="w-full h-full object-cover" alt="Cityscape" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900"></div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
            Find Premium <span className="text-primary">Escorts</span> in Your City
          </h1>
          <p className="text-xl text-slate-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Discover elite companions across the United States and Canada. The most trusted platform for high-end classifieds.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-2 rounded-[2.5rem] shadow-2xl">
              <div className="flex-grow flex items-center px-6 gap-3">
                <MapPin className="text-primary" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by city (e.g. Miami, New York...)" 
                  className="w-full py-4 text-slate-800 outline-none placeholder:text-slate-400 font-medium"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />
              </div>
              <button 
                className="btn-primary py-4 px-10 rounded-[2rem] flex items-center justify-center gap-2"
                onClick={() => searchQuery && handleSearch(filteredCities[0]?.slug)}
              >
                <Search size={20} />
                Search
              </button>
            </div>

            {showDropdown && searchQuery && (
              <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                {filteredCities.length > 0 ? (
                  filteredCities.map(city => (
                    <button
                      key={city.id}
                      className="w-full px-8 py-4 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors"
                      onClick={() => handleSearch(city.slug)}
                    >
                      <span className="font-bold text-slate-800 group-hover:text-primary">{city.name}, {city.state}</span>
                      <ChevronDown className="text-slate-300 -rotate-90" size={16} />
                    </button>
                  ))
                ) : (
                  <div className="p-6 text-slate-400 font-medium italic">No cities found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats Section stays same... */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="card-premium flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Shield size={28} /></div>
              <div>
                <h3 className="font-bold text-lg">Verified Profiles</h3>
                <p className="text-slate-500 text-sm">Strict moderation for your safety.</p>
              </div>
           </div>
           <div className="card-premium flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary"><Zap size={28} /></div>
              <div>
                <h3 className="font-bold text-lg">Instant Bump</h3>
                <p className="text-slate-500 text-sm">Boost your ad visibility in seconds.</p>
              </div>
           </div>
           <div className="card-premium flex items-center gap-6">
              <div className="bg-primary/10 p-4 rounded-2xl text-primary"><TrendingUp size={28} /></div>
              <div>
                <h3 className="font-bold text-lg">Top Rankings</h3>
                <p className="text-slate-500 text-sm">Reach thousands of daily visitors.</p>
              </div>
           </div>
        </div>
      </section>

      {/* Featured Escorts Section stays same... */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">Featured Escorts</h2>
            <p className="text-slate-500 mt-2">The most reviewed and trusted companions.</p>
          </div>
          <Link to="/cities" className="text-primary font-bold hover:underline mb-2">View all cities →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {loadingAds ? (
            <div className="col-span-full py-20 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            </div>
          ) : featuredAds.length > 0 ? (
            featuredAds.map(escort => (
              <div key={escort.id} className="group card-premium !p-0 overflow-hidden">
                 <div className="h-96 relative overflow-hidden">
                    <img 
                      src={getMainImage(escort.photo_url)} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt={escort.title} 
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                        Featured
                      </span>
                    </div>
                 </div>
                 <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{escort.title}, {escort.age}</h3>
                        <div className="flex items-center text-slate-500 text-sm mt-1 gap-1">
                          <MapPin size={14} /> {escort.city_name}, {escort.state_name}
                        </div>
                      </div>
                    </div>
                    <p className="text-slate-600 line-clamp-2 mb-6 leading-relaxed">
                      {escort.description}
                    </p>
                    <Link to={`/profile/${escort.id}`} className="btn-primary w-full inline-block text-center">View Profile</Link>
                 </div>
              </div>
            ))
          ) : (
             <div className="col-span-full py-10 text-center text-slate-500">No featured ads at the moment.</div>
          )}
        </div>
      </section>

      {/* How it works stays same... */}
      <section className="bg-slate-50 py-24">
         <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
              <p className="text-slate-500 mt-4 max-w-xl mx-auto">Getting started with Escort Provider is simple and professional.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {[
                 { step: '01', title: 'Create Account', desc: 'Register as an independent escort or agency.' },
                 { step: '02', title: 'Deposit Funds', desc: 'Add minimum $100 using Bitcoin or Ethereum.' },
                 { step: '03', title: 'Post Your Ad', desc: 'Create a stunning listing with photos and details.' },
                 { step: '04', title: 'Get Noticed', desc: 'Receive inquiries from local clients immediately.' },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                    <span className="text-4xl font-black text-primary/10 block mb-6">{item.step}</span>
                    <h4 className="font-bold text-lg mb-3">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Browse by City - Now using dynamic data */}
      <section className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900">Browse by City</h2>
            <p className="text-slate-500 mt-2">Popular advertising locations across North America.</p>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {citiesLoading ? (
              <div className="col-span-full py-20 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
                <p className="text-slate-400 font-bold">Discovering premium locations...</p>
              </div>
            ) : (
              cities.slice(0, 8).map((city) => (
                <Link 
                  key={city.id} 
                  to={`/escorts/${city.slug}`}
                  className="card-premium group hover:bg-primary transition-colors duration-500 text-center py-10"
                >
                   <h4 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors">{city.name}</h4>
                   <p className="text-primary mt-2 group-hover:text-white/80 transition-colors font-semibold">
                     {city.state}, {city.country === 'Canada' ? 'CA' : 'US'}
                   </p>
                </Link>
              ))
            )}
         </div>
         
         <div className="mt-12 text-center">
            <Link to="/cities" className="btn-secondary py-4 px-12 inline-block">View All {cities.length} Cities</Link>
         </div>
      </section>
    </div>
  );
}
