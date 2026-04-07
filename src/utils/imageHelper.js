import { BASE_URL } from '../lib/api';

export const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600';

export const getImageUrl = (url) => {
  if (!url) return FALLBACK_IMAGE;
  if (url.startsWith('http')) return url;
  // Prefix with server URL if relative
  const cleanUrl = url.startsWith('/') ? url : `/${url}`;
  return `${BASE_URL}${cleanUrl}`;
};

export const parsePhotos = (photoUrl) => {
  if (!photoUrl) return [];
  try {
    const parsed = JSON.parse(photoUrl);
    return Array.isArray(parsed) ? parsed : [photoUrl];
  } catch {
    return [photoUrl];
  }
};

export const getMainImage = (photoUrl) => {
  const photos = parsePhotos(photoUrl);
  return getImageUrl(photos[0]);
};
