import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Camera, MapPin, DollarSign, ChevronDown, Check, Loader2, AlertCircle, X } from 'lucide-react';
import { useCities } from '../../hooks/useCities';
import { api } from '../../lib/api';
import { parsePhotos, getImageUrl, FALLBACK_IMAGE } from '../../utils/imageHelper';

export default function EditAd() {
  const { id } = useParams();
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
    whatsapp: '',
    telegram: '',
    instagram: '',
  });

  const [existingPhotos, setExistingPhotos] = useState([]); // URLs already on server
  const [newImages, setNewImages] = useState([]);            // new File objects
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchAd() {
      try {
        const data = await api.get(`/ads/${id}`);
        setFormData({
          name: data.title || '',
          age: data.age || '',
          cityId: data.city_id || '',
          cityName: data.city_name || '',
          state: data.state_code || '',
          description: data.description || '',
          hourlyRate: '',
          phone: data.phone || '',
          whatsapp: data.whatsapp || '',
          telegram: data.telegram || '',
          instagram: data.instagram || '',
        });
        setCitySearch(data.city_name ? `${data.city_name}, ${data.state_code}` : '');
        const photos = parsePhotos(data.photo_url);
        setExistingPhotos(photos);
      } catch (err) {
        setError('Failed to load ad. It may not exist or you may not have access.');
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [id]);

  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(citySearch.toLowerCase()) ||
    (city.state_code || '').toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 10);

  const selectCity = (city) => {
    setFormData(prev => ({ ...prev, cityId: city.id, cityName: city.name, state: city.state_code }));
    setCitySearch(`${city.name}, ${city.state_code}`);
    setShowCityDropdown(false);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalAllowed = 4 - existingPhotos.length;
    if (newImages.length + files.length > totalAllowed) {
      setError(`You can only add ${totalAllowed} more photo(s).`);
      return;
    }
    const tagged = files.map(file => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
    setNewImages(prev => [...prev, ...tagged]);
  };

  const removeExisting = (idx) => {
    setExistingPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNew = (idx) => {
    setNewImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.cityId) {
      setError('Please fill in the name and city.');
      return;
    }
    if (existingPhotos.length + newImages.length === 0) {
      setError('Please keep or upload at least one photo.');
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
      data.append('phone', formData.phone);
      data.append('whatsapp', formData.whatsapp);
      data.append('telegram', formData.telegram);
      data.append('instagram', formData.instagram);
      data.append('existing_photos', JSON.stringify(existingPhotos));

      newImages.forEach(file => data.append('photos', file));

      await api.put(`/ads/${id}`, data, token);
      setSuccess(true);
      setTimeout(() => navigate('/dashboard/ads'), 1500);
    } catch (err) {
      setError(err.message || 'Failed to update ad.');
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

  const totalPhotos = existingPhotos.length + newImages.length;

  return (
    <div className="space-y-12 pb-12">
      <div>
        <h1 className="text-4xl font-black text-slate-900 mb-2">Edit Ad</h1>
        <p className="text-slate-500 font-medium pb-8 border-b border-gray-100 italic">Update your listing details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          {/* Basic Info */}
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
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2 ml-1">Age</label>
                <input
                  type="number"
                  className="input-field px-6 py-4"
                  placeholder="e.g. 24"
                  value={formData.age}
                  onChange={e => setFormData(prev => ({ ...prev, age: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <label className="block text-slate-700 font-bold mb-2 ml-1">City</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                  <input
                    type="text"
                    className="input-field pl-14 pr-12 px-6 py-4"
                    placeholder="Search city..."
                    value={citySearch}
                    onChange={e => { setCitySearch(e.target.value); setShowCityDropdown(true); }}
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
                <label className="block text-slate-700 font-bold mb-2 ml-1">State</label>
                <input type="text" className="input-field bg-slate-50 cursor-not-allowed px-6 py-4" value={formData.state} readOnly placeholder="Auto-filled" />
              </div>
            </div>
          </section>

          {/* Photos */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">02</div>
              Photos ({totalPhotos}/4)
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Existing photos */}
              {existingPhotos.map((url, idx) => (
                <div key={`existing-${idx}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group border border-gray-100">
                  <img
                    src={getImageUrl(url)}
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover"
                    alt={`Photo ${idx + 1}`}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  <button
                    type="button"
                    onClick={() => removeExisting(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase text-white bg-black/40 px-2 py-0.5 rounded-full">Saved</span>
                </div>
              ))}

              {/* New photos pending upload */}
              {newImages.map((file, idx) => (
                <div key={`new-${idx}`} className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-sm group border-2 border-primary/30">
                  <img src={file.preview} className="w-full h-full object-cover" alt={`New ${idx + 1}`} />
                  <button
                    type="button"
                    onClick={() => removeNew(idx)}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                  <span className="absolute bottom-2 left-2 text-[9px] font-black uppercase text-white bg-primary/80 px-2 py-0.5 rounded-full">New</span>
                </div>
              ))}

              {/* Add more slot */}
              {totalPhotos < 4 && (
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
          </section>

          {/* Bio */}
          <section className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-black">03</div>
              Bio & Contact
            </h3>
            <textarea
              className="input-field min-h-[160px] resize-none py-6 px-6"
              placeholder="Write your description here..."
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
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
                    onChange={e => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2 ml-1">Phone Number</label>
                <input
                  type="text"
                  className="input-field px-6 py-4"
                  placeholder="+1 555 000 0000"
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div>
                <label className="block text-slate-700 font-bold mb-2 ml-1">WhatsApp</label>
                <input
                  type="text"
                  className="input-field px-6 py-4"
                  placeholder="+1 555 000 0000"
                  value={formData.whatsapp}
                  onChange={e => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2 ml-1">Telegram</label>
                <input
                  type="text"
                  className="input-field px-6 py-4"
                  placeholder="@username"
                  value={formData.telegram}
                  onChange={e => setFormData(prev => ({ ...prev, telegram: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-slate-700 font-bold mb-2 ml-1">Instagram</label>
                <input
                  type="text"
                  className="input-field px-6 py-4"
                  placeholder="@username"
                  value={formData.instagram}
                  onChange={e => setFormData(prev => ({ ...prev, instagram: e.target.value }))}
                />
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="sticky top-32 card-premium p-8 bg-white border-2 border-primary/5 space-y-6">
            <h4 className="text-xl font-bold text-slate-900 border-b border-gray-50 pb-4">Save Changes</h4>

            {error && (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold flex items-start gap-3 border border-red-100">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-sm font-bold flex items-center gap-3 border border-emerald-100">
                <Check size={18} /> Ad updated! Redirecting...
              </div>
            )}

            <p className="text-slate-400 text-sm leading-relaxed">
              Editing is free. Your ad will stay active — only the details you change will be updated.
            </p>

            <button
              onClick={handleSubmit}
              disabled={submitting || success}
              className="w-full btn-primary !py-5 text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <Check size={24} />}
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>

            <Link
              to="/dashboard/ads"
              className="w-full btn-secondary !py-4 text-sm flex items-center justify-center gap-2"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
