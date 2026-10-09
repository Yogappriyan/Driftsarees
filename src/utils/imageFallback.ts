import React from 'react';

// Hosted high-resolution luxury bridal saree photography hosted on CDN
export const POSTIMG_URLS = {
  roseNet: 'https://i.postimg.cc/FKGDVMc7/editorial-model-rose-net-1790444842708.jpg',
  kanjivaram: 'https://i.postimg.cc/rpgQNBWt/editorial-model-kanjivaram-1790444829857.jpg',
  ivoryOrganza: 'https://i.postimg.cc/rpgQNBWz/editorial-model-ivory-organza-1790444853542.jpg',
  royalCrimson: 'https://i.postimg.cc/SssVTg78/editorial-model-royal-crimson-1790444865420.jpg',
  mustardPaithani: 'https://i.postimg.cc/1zMJrk6q/editorial-model-mustard-paithani-1790444917179.jpg',
  sapphire: 'https://i.postimg.cc/G22z7XJG/editorial-model-sapphire-1790444892272.jpg',
  craftLoom: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1600&q=85',
  heroSalon: 'https://i.postimg.cc/YSSyZ2tn/Luxurious-Indian-Saree-Boutique-Interior.png',
  boutiqueInterior: 'https://i.postimg.cc/YSSyZ2tn/Luxurious-Indian-Saree-Boutique-Interior.png',
};

export const FALLBACK_SAREE_IMAGES: string[] = [
  POSTIMG_URLS.royalCrimson,
  POSTIMG_URLS.kanjivaram,
  POSTIMG_URLS.ivoryOrganza,
  POSTIMG_URLS.mustardPaithani,
  POSTIMG_URLS.roseNet,
  POSTIMG_URLS.sapphire,
];

/**
 * Normalizes image URLs so they work across dev and production (Vercel, Netlify, etc.)
 * Maps legacy relative filenames and paths to permanent high-availability CDN links.
 */
export function normalizeImageUrl(url?: string | null): string {
  if (!url) return FALLBACK_SAREE_IMAGES[0];

  // If already a data: URL (from admin device upload) or blob:, return directly
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }

  // Canonical mapping for legacy or relative paths
  if (url.includes('rose_net') || url.includes('rose-net')) {
    return POSTIMG_URLS.roseNet;
  }
  if (url.includes('kanjivaram')) {
    return POSTIMG_URLS.kanjivaram;
  }
  if (url.includes('ivory_organza') || url.includes('ivory-organza')) {
    return POSTIMG_URLS.ivoryOrganza;
  }
  if (url.includes('royal_crimson') || url.includes('royal-crimson')) {
    return POSTIMG_URLS.royalCrimson;
  }
  if (url.includes('mustard_paithani') || url.includes('mustard-paithani')) {
    return POSTIMG_URLS.mustardPaithani;
  }
  if (url.includes('sapphire')) {
    return POSTIMG_URLS.sapphire;
  }
  if (url.includes('editorial_craft_loom') || url.includes('craft-loom')) {
    return POSTIMG_URLS.craftLoom;
  }
  if (url.includes('hero_boutique_salon') || url.includes('hero-boutique') || url.includes('Boutique-Interior') || url.includes('boutique_interior') || url.includes('boutique-interior')) {
    return POSTIMG_URLS.heroSalon;
  }

  // If it's already an absolute HTTP/HTTPS URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  return url;
}

/**
 * Fallback event handler for React <img> elements.
 * If an image fails to load, gracefully switches to a verified postimg hosted bridal saree photo.
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement, Event>,
  customFallback?: string
) {
  const target = e.currentTarget;
  const attempts = parseInt(target.dataset.errorAttempts || '0', 10);

  if (attempts >= 3) return; // Prevent infinite re-render loops

  target.dataset.errorAttempts = (attempts + 1).toString();
  target.src = customFallback || FALLBACK_SAREE_IMAGES[attempts % FALLBACK_SAREE_IMAGES.length];
}
