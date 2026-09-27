// Global safe smooth scrolling helper compatible with iFrames and all modern browsers
export function scrollToElement(selectorOrId: string, offset: number = -70) {
  try {
    const cleanId = selectorOrId.startsWith('#') ? selectorOrId.slice(1) : selectorOrId;
    const target = document.getElementById(cleanId) || document.querySelector(selectorOrId);

    if (!target) {
      console.warn(`[Scroll] Target element not found: ${selectorOrId}`);
      return;
    }

    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset + offset;

    window.scrollTo({
      top: Math.max(0, offsetPosition),
      behavior: 'smooth',
    });
  } catch (err) {
    console.error('[Scroll] Error scrolling to element:', err);
  }
}
