import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin, Phone, ShieldCheck, Send,
  Clock, ChevronLeft, ChevronRight, Loader2, AlertCircle, MessageCircle
} from 'lucide-react';
import { api } from '../lib/api';
import { getImageUrl, parsePhotos, FALLBACK_IMAGE } from '../utils/imageHelper';

export default function Profile() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showPhone, setShowPhone] = useState(false);

  useEffect(() => {
    async function fetchAd() {
      try {
        const data = await api.get(`/ads/${id}`);
        setAd(data);
      } catch (err) {
        setError(err.message || 'Ad not found.');
      } finally {
        setLoading(false);
      }
    }
    fetchAd();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="text-primary animate-spin mb-4" size={48} />
        <p className="text-slate-500 font-bold">Opening profile...</p>
      </div>
    );
  }

  if (error || !ad) {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center">
        <AlertCircle size={64} className="text-red-500 mb-6" />
        <h2 className="text-3xl font-black text-slate-800 mb-4">Ad Not Found</h2>
        <p className="text-slate-500 mb-8 font-medium">This listing may have expired or been removed.</p>
        <Link to="/cities" className="btn-primary">Browse Other Cities</Link>
      </div>
    );
  }

  const images = (() => {
    const list = parsePhotos(ad.photo_url);
    return list.map(img => getImageUrl(img));
  })();

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <Link to="/cities" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors font-medium mb-8">
         <ChevronLeft size={20} /> Back to Listings
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Photos */}
        <div className="lg:col-span-7">
          <div className="relative h-[600px] w-full rounded-[3rem] overflow-hidden shadow-2xl bg-slate-100">
             <img
               src={images[activeImage]}
               onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }}
               className="w-full h-full object-cover transition-opacity duration-500"
               alt={`${ad.title} main`}
             />
             {images.length > 1 && (
               <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 hover:opacity-100 transition-opacity">
                  <button onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"><ChevronLeft size={24} /></button>
                  <button onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)} className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/40"><ChevronRight size={24} /></button>
               </div>
             )}
          </div>
          <div className="grid grid-cols-5 gap-4 mt-6">
             {images.map((img, idx) => (
               <button 
                 key={idx}
                 onClick={() => setActiveImage(idx)}
                 className={`h-28 rounded-2xl overflow-hidden border-4 transition-all ${activeImage === idx ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'}`}
               >
                 <img src={img} onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMAGE; }} className="w-full h-full object-cover" alt={`${ad.title} thumb ${idx}`} />
               </button>
             ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="lg:col-span-5">
           <div className="sticky top-32">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                     <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Member</span>
                     <span className="bg-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={10} /> Verified
                     </span>
                  </div>
                  <h1 className="text-5xl font-black text-slate-900">{ad.title}, {ad.age}</h1>
                  <div className="flex items-center text-slate-500 gap-4 mt-2 font-medium">
                     <span className="flex items-center gap-1"><MapPin size={16} /> {ad.city_name}, {ad.state_name}</span>
                     <span className="flex items-center gap-1"><Clock size={16} /> Active</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-8">
                 <div className="bg-slate-50 p-6 rounded-3xl">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider block mb-1">Rates starting from</span>
                    <span className="text-3xl font-black text-slate-900">Contact for Rates</span>
                 </div>
              </div>

              <div className="space-y-3 mb-10">
                {/* Phone */}
                {ad.phone && (
                  <button
                    onClick={() => setShowPhone(!showPhone)}
                    className="w-full btn-primary !py-4 text-base flex items-center justify-center gap-3"
                  >
                    <Phone size={20} />
                    {showPhone ? ad.phone : 'Show Phone Number'}
                  </button>
                )}

                {/* WhatsApp */}
                {ad.whatsapp && (
                  <a
                    href={`https://wa.me/${ad.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 !py-4 text-base font-bold rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white transition-all shadow-lg shadow-emerald-500/20"
                  >
                    <MessageCircle size={20} /> WhatsApp
                  </a>
                )}

                {/* Telegram */}
                {ad.telegram && (
                  <a
                    href={`https://t.me/${ad.telegram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 !py-4 text-base font-bold rounded-2xl bg-sky-500 hover:bg-sky-600 text-white transition-all shadow-lg shadow-sky-500/20"
                  >
                    <Send size={20} /> Telegram
                  </a>
                )}

                {/* Instagram */}
                {ad.instagram && (
                  <a
                    href={`https://instagram.com/${ad.instagram.replace(/^@/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-3 !py-4 text-base font-bold rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 hover:opacity-90 text-white transition-all shadow-lg shadow-pink-500/20"
                  >
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                    Instagram
                  </a>
                )}

                {/* Fallback if no contact info at all */}
                {!ad.phone && !ad.whatsapp && !ad.telegram && !ad.instagram && (
                  <div className="w-full py-4 text-center text-slate-400 font-medium text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    No contact info provided
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-8">
                 <h4 className="font-bold text-slate-900 mb-4">Quick Details</h4>
                 <div className="grid grid-cols-1 gap-y-3">
                    <div className="flex justify-between">
                       <span className="text-slate-400 text-sm">Location</span>
                       <span className="text-slate-900 text-sm font-bold">{ad.city_name}, {ad.state_name}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-slate-400 text-sm">Status</span>
                       <span className="text-emerald-500 text-sm font-bold uppercase tracking-widest">Available</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-20">
         <h2 className="text-3xl font-bold text-slate-900 mb-8 border-b border-gray-100 pb-4">Personal Description</h2>
         <div className="prose prose-slate max-w-none">
            <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-wrap">{ad.description}</p>
         </div>
      </div>
    </div>
  );
}
