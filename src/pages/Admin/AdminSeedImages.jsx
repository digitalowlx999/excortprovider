import { useState, useEffect } from 'react';
import { Trash2, Plus, Image, Loader2, RefreshCw, Database } from 'lucide-react';
import { api } from '../../lib/api';

const CATEGORIES = ['blonde', 'brunette', 'latina', 'asian', 'fitness', 'ebony'];

const CATEGORY_COLORS = {
  blonde: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  brunette: 'bg-orange-50 text-orange-700 border-orange-200',
  latina: 'bg-pink-50 text-pink-700 border-pink-200',
  asian: 'bg-purple-50 text-purple-700 border-purple-200',
  fitness: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  ebony: 'bg-amber-50 text-amber-700 border-amber-200',
};

export default function AdminSeedImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blonde');
  const [newUrl, setNewUrl] = useState('');
  const [adding, setAdding] = useState(false);
  const [status, setStatus] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [initializing, setInitializing] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setLoading(true);
    try {
      const data = await api.get('/admin/seed-images', token);
      setImages(Array.isArray(data) ? data : []);
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to load images: ' + err.message });
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newUrl.trim()) return;
    setAdding(true);
    setStatus(null);
    try {
      const added = await api.post('/admin/seed-images', { category: activeTab, url: newUrl.trim() }, token);
      setImages(prev => [added, ...prev]);
      setNewUrl('');
      setStatus({ type: 'success', text: 'Image added successfully!' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Failed to add: ' + err.message });
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id) {
    setDeleting(id);
    setStatus(null);
    try {
      await api.delete(`/admin/seed-images/${id}`, token);
      setImages(prev => prev.filter(img => img.id !== id));
      setStatus({ type: 'success', text: 'Image deleted.' });
    } catch (err) {
      setStatus({ type: 'error', text: 'Delete failed: ' + err.message });
    } finally {
      setDeleting(null);
    }
  }

  async function handleInitializeDB() {
    setInitializing(true);
    setStatus(null);
    try {
      // Direct raw fetch because API root is VITE_API_URL and this route is under /api
      const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';
      const cleanUrl = VITE_API_URL.replace(/\/+$/, ''); // Remove trailing slashes
      const res = await fetch(`${cleanUrl}/seed-dummy/init-seed-images-table`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize database');
      
      setStatus({ type: 'success', text: `Success! ${data.imagesInserted} images added.` });
      loadImages();
    } catch (err) {
      setStatus({ type: 'error', text: 'Initialization error: ' + err.message });
    } finally {
      setInitializing(false);
    }
  }

  const filtered = images.filter(img => img.category === activeTab);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 mb-2">Seed Image Gallery</h1>
          <p className="text-slate-500 font-medium">Manage the photos used to generate dummy escort ads.</p>
        </div>
        <button
          onClick={loadImages}
          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-2xl transition"
        >
          <RefreshCw size={15} />
          Refresh
        </button>
      </div>

      {/* Status Banner */}
      {status && (
        <div className={`px-5 py-3 rounded-2xl text-sm font-semibold ${
          status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
        }`}>
          {status.text}
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-5 py-2 rounded-full text-sm font-bold border capitalize transition-all ${
              activeTab === cat
                ? 'bg-primary text-white border-primary shadow-md scale-105'
                : 'bg-white text-slate-600 border-gray-200 hover:border-primary hover:text-primary'
            }`}
          >
            {cat}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {images.filter(i => i.category === cat).length}
            </span>
          </button>
        ))}
      </div>

      {/* Add New Image */}
      <div className="bg-white border border-gray-100 rounded-[2rem] p-6">
        <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
          <Plus size={14} />
          Add Image to <span className="text-primary capitalize">{activeTab}</span>
        </h3>
        <div className="flex gap-3">
          <input
            type="url"
            placeholder="Paste Pinterest image URL here… (e.g. https://i.pinimg.com/…)"
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-5 py-3 bg-slate-50 border border-gray-200 rounded-2xl text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newUrl.trim()}
            className="flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-2xl hover:opacity-90 transition disabled:opacity-50"
          >
            {adding ? <Loader2 size={15} className="animate-spin" /> : <Plus size={15} />}
            Add
          </button>
        </div>
      </div>

      {/* Image Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="animate-spin text-primary mb-4" size={40} />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading gallery...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-slate-300">
          <Image size={56} className="mb-4" />
          <p className="font-bold text-lg capitalize">No images in {activeTab}</p>
          <p className="text-sm mt-1 mb-6">Add one above to get started</p>
          
          {images.length === 0 && (
             <button
               onClick={handleInitializeDB}
               disabled={initializing}
               className="flex items-center gap-2 bg-slate-800 text-white font-bold px-6 py-3 rounded-2xl hover:bg-slate-700 transition disabled:opacity-50"
             >
               {initializing ? <Loader2 size={16} className="animate-spin" /> : <Database size={16} />}
               {initializing ? 'Initializing...' : 'Initialize DB with 90 Defaults'}
             </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map(img => (
            <div key={img.id} className="group relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <img
                src={img.url}
                alt="Seed"
                className="w-full h-44 object-cover"
                onError={e => { e.target.src = 'https://placehold.co/300x400?text=Broken'; }}
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => handleDelete(img.id)}
                  disabled={deleting === img.id}
                  className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg"
                  title="Delete image"
                >
                  {deleting === img.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
              {/* Category badge */}
              <div className={`absolute top-2 left-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[img.category] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {img.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
