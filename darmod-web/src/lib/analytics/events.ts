declare global {
  interface Window {
    fbq: any;
  }
}

const isBrowser = typeof window !== "undefined";

export const trackPageView = () => {
  if (!isBrowser || !window.fbq) return;
  window.fbq("track", "PageView");
};

export const trackWhatsAppClick = () => {
  if (!isBrowser || !window.fbq) return;
  window.fbq("track", "Contact");
};

export const trackCallClick = () => {
  if (!isBrowser || !window.fbq) return;
  window.fbq("track", "Contact");
};