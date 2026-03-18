import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Camera, MapPin, DollarSign, Info, Plus, ChevronDown, Check, Loader2, AlertCircle } from 'lucide-react';
import { useCities } from '../../hooks/useCities';
import { api } from '../../lib/api';

export default function PostAd() {
  const navigate = useNavigate();
  const { cities, loading: citiesLoading } = useCities();
  
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    cityId: '',
    cityName: '',
    state: '',
    description: '',
    hourlyRate: '',
    phone: '',
    images: [] // Storing File objects
  });

  const [userBalance, setUserBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [error, setError] = useState(null);

  const AD_PRICE = 10;

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    try {
      const profile = await api.get('/auth/profile', token);
      setUserBalance(profile?.wallet_balance || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const filteredCities = cities.filter(city => 
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    (city.state_code || '').toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 10);

  const selectCity = (city) => {
    setFormData({
      ...formData,
      cityId: city.id,
      cityName: city.name,
      state: city.state_code
    });
    setCitySearch(`${city.name}, ${city.state_code}`);
    setShowCityDropdown(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Check combined length
    if (formData.images.length + files.length > 4) {
      setError("Maximum 4 photos allowed.");
      return;
    }
    
    // Create preview URLs for the UI
    const newFiles = files.map(file => {
      file.preview = URL.createObjectURL(file);
      return file;
    });

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...newFiles]
    }));
  };

  const removeImage = (indexToRemove) => {
    setFormData(prev => {
      const newImages = prev.images.filter((_, index) => index !== indexToRemove);
      return { ...prev, images: newImages };
    });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.cityId || !formData.hourlyRate) {
      setError("Please fill in all required fields.");
      return;
    }
    
    if (formData.images.length === 0) {
      setError("Please upload at least one listing photo.");
      return;
    }

    if (userBalance < AD_PRICE) {
      setError(`Insufficient balance. You need $${AD_PRICE} to post an ad.`);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const data = new FormData();
      data.append('title', formData.name);
      data.append('age', formData.age);
      data.append('city_id', formData.cityId);
      data.append('description', formData.description);
      
      formData.images.forEach(file => {
        data.append('photos', file);
      });

      await api.post('/ads', data, token);
      
      navigate('/dashboard/ads');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Create New Ad</h1>
        <p className="text-slate-500 font-medium pb-8 border-b border-gray-100 italic">Secure your spot in the city directory.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
           {/* Section: Basic Info */}
           <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">01</div>
                 Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">Alias / Name</label>
                    <input 
                      type="text" 
                      className="input-field px-6 py-4" 
                      placeholder="e.g. Elena Miami" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">Age</label>
                    <input 
                      type="number" 
                      className="input-field px-6 py-4" 
                      placeholder="e.g. 24" 
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="relative">
                    <label className="block text-slate-700 font-bold mb-2 ml-1">City Search</label>
                    <div className="relative">
                       <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input 
                          type="text" 
                          className="input-field pl-14 pr-12 px-6 py-4" 
                          placeholder="Search city..." 
                          value={citySearch}
                          onChange={(e) => {
                            setCitySearch(e.target.value);
                            setShowCityDropdown(true);
                          }}
                          onFocus={() => setShowCityDropdown(true)}
                       />
                       <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                    </div>

                    {showCityDropdown && (
                      <div className="absolute z-50 left-0 right-0 top-full mt-2 bg-white rounded-3xl border border-gray-100 shadow-2xl overflow-hidden">
                        {citiesLoading ? (
                          <div className="p-6 text-center text-slate-400 font-medium">Loading cities...</div>
                        ) : filteredCities.length > 0 ? (
                          <div className="max-h-[300px] overflow-y-auto">
                            {filteredCities.map(city => (
                              <button
                                key={city.id}
                                className="w-full px-6 py-4 text-left hover:bg-slate-50 flex items-center justify-between group transition-colors"
                                onClick={() => selectCity(city)}
                              >
                                <div>
                                   <span className="font-bold text-slate-900 group-hover:text-primary">{city.name}</span>
                                   <span className="ml-2 text-slate-400 font-medium">{city.state_code}</span>
                                </div>
                                {formData.cityId === city.id && <Check className="text-primary" size={18} />}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 text-center text-slate-400 font-medium italic">No cities found</div>
                        )}
                      </div>
                    )}
                 </div>
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">State / Province</label>
                    <input type="text" className="input-field bg-slate-50 cursor-not-allowed px-6 py-4" value={formData.state} readOnly placeholder="Auto-filled" />
                 </div>
              </div>
           </section>

           <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">02</div>
                 Photos (Max 4)
              </h3>
              <div className="space-y-6">
                 <p className="text-slate-500 text-sm font-medium ml-1">Upload up to 4 high-quality photos for your ad.</p>
                 
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.map((file, idx) => (
                      <div key={idx} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
                        <img src={file.preview} alt={`Upload ${idx+1}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <button 
                          type="button" 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    
                    {formData.images.length < 4 && (
                      <label className="aspect-[3/4] rounded-2xl border-2 border-dashed border-gray-200 bg-slate-50 hover:bg-primary/5 hover:border-primary/30 transition-all flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-primary">
                        <Camera size={28} className="mb-2" />
                        <span className="text-xs font-bold uppercase tracking-wider">Add Photo</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                 </div>
              </div>
           </section>

           <section className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">03</div>
                 Bio & Contact
              </h3>
              <textarea 
                className="input-field min-h-[160px] resize-none py-6 px-6" 
                placeholder="Write your description here..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">Hourly Rate ($)</label>
                    <div className="relative">
                       <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                       <input 
                         type="number" 
                         className="input-field pl-14 px-6 py-4" 
                         placeholder="e.g. 250" 
                         value={formData.hourlyRate}
                         onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                       />
                    </div>
                 </div>
                 <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1">WhatsApp / Phone</label>
                    <input 
                      type="text" 
                      className="input-field px-6 py-4" 
                      placeholder="+1..." 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                 </div>
              </div>
           </section>
        </div>

        <div className="lg:col-span-4">
           <div className="sticky top-32 card-premium p-8 bg-white border-2 border-primary/5">
              <h4 className="text-xl font-bold text-slate-900 mb-8 border-b border-gray-50 pb-4">Payment Summary</h4>

              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center px-2">
                    <span className="text-slate-500 font-medium">Standard Listing Fee</span>
                    <span className="text-slate-900 font-bold text-lg">${AD_PRICE}.00</span>
                 </div>
                 
                 <div className="pt-6 border-t border-gray-50 flex justify-between items-center px-2">
                    <span className="text-slate-900 text-lg font-black">Total Charge</span>
                    <span className="text-primary text-3xl font-black">${AD_PRICE}.00</span>
                 </div>
              </div>

              <div className="p-6 bg-slate-900 rounded-[2rem] text-white mb-10 shadow-xl shadow-slate-900/10">
                 <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Your Current Balance</span>
                    <span className={`font-bold ${userBalance >= AD_PRICE ? 'text-emerald-400' : 'text-red-400'}`}>${Number(userBalance || 0).toFixed(2)}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Balance After</span>
                    <span className="text-white font-bold">${Math.max(0, Number(userBalance || 0) - AD_PRICE).toFixed(2)}</span>
                 </div>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold flex items-center gap-3 border border-red-100">
                   <AlertCircle size={18} /> {error}
                </div>
              )}

              {userBalance < AD_PRICE ? (
                <Link to="/dashboard/wallet" className="w-full btn-secondary !py-5 text-lg flex items-center justify-center gap-2">
                   Deposit Funds First
                </Link>
              ) : (
                <button 
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full btn-primary !py-5 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                   {submitting ? <Loader2 className="animate-spin" size={24} /> : 'Publish Listing'}
                </button>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
