import React from 'react';

// Reliable high-resolution luxury bridal saree photography hosted on CDN as secondary fallback
export const FALLBACK_SAREE_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80',
];

/**
 * Normalizes image URLs so they work across dev and production (Vercel, Netlify, etc.)
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_SAREE_IMAGES[0];
  // If it's already an absolute HTTP/HTTPS URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it starts with /src/assets/images/, normalize to /assets/images/
  if (url.startsWith('/src/assets/images/')) {
    return url.replace('/src/assets/images/', '/assets/images/');
  }
  return url;
}

/**
 * Fallback event handler for React <img> elements.
 * If an image fails to load, gracefully attempts alternative relative paths
 * before switching to a verified editorial bridal saree photo.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) {
  const target = e.currentTarget;
  const currentSrc = target.getAttribute('src') || '';
  const attempts = parseInt(target.dataset.errorAttempts || '0', 10);

  target.dataset.errorAttempts = (attempts + 1).toString();

  // Attempt 1: If URL had /src/assets/images/, try /assets/images/
  if (attempts === 0 && currentSrc.includes('/src/assets/images/')) {
    target.src = currentSrc.replace('/src/assets/images/', '/assets/images/');
    return;
  }

  // Attempt 2: If URL had /assets/images/, try /src/assets/images/
  if (attempts === 0 && currentSrc.includes('/assets/images/')) {
    target.src = currentSrc.replace('/assets/images/', '/src/assets/images/');
    return;
  }

  // Final fallback: Use high-res luxury bridal photo from CDN
  target.src = customFallback || FALLBACK_SAREE_IMAGES[attempts % FALLBACK_SAREE_IMAGES.length];
}
