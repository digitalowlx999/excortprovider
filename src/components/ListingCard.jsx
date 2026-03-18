import { Link } from 'react-router-dom';
import { MapPin, Heart, Star, ShieldCheck } from 'lucide-react';
import { BASE_URL } from '../lib/api';

export default function ListingCard({ ad }) {
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600';
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url}`;
  };

  const images = (() => {
    try {
      const parsed = JSON.parse(ad.photo_url);
      return Array.isArray(parsed) ? parsed : [ad.photo_url];
    } catch {
      return [ad.photo_url];
    }
  })();

  const mainImage = getImageUrl(images[0]);
  return (
    <div className="group card-premium !p-0 overflow-hidden flex flex-col h-full">
      <div className="h-80 relative overflow-hidden">
        <img 
          src={mainImage} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          alt={ad.title} 
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           {ad.is_featured ? (
             <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black text-primary uppercase tracking-widest shadow-sm">
               Featured
             </span>
           ) : null}
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
            {ad.title}, {ad.age}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-400 text-xs gap-3 mb-4">
          <span className="flex items-center gap-1 font-medium"><MapPin size={12} /> {ad.city_name}</span>
          <span className="flex items-center gap-1 font-medium"><Clock size={12} /> {new Date(ad.created_at).toLocaleDateString()}</span>
        </div>

        <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
          {ad.description}
        </p>

        <Link 
          to={`/profile/${ad.id}`} 
          className="w-full btn-secondary !py-3 !text-sm flex items-center justify-center gap-2 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300"
        >
          View Profile
          <span className="transform group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}
