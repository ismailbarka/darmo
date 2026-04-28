export const FB_PIXEL_ID = "1282964636728385";

// Only log in development mode
const isDev = process.env.NODE_ENV === "development";

const log = (message: string, ...args: any[]) => {
  if (isDev) {
    console.log(`[Analytics] ${message}`, ...args);
  }
};

/**
 * Standard Facebook Pixel PageView event
 */
export const pageview = () => {
  if (typeof window !== "undefined" && window.fbq) {
    log("PageView");
    window.fbq("track", "PageView");
  } else {
    log("PageView - skipped (fbq not found)");
  }
};

/**
 * Generic Facebook Pixel event
 */
export const event = (name: string, options = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    log(`Event: ${name}`, options);
    window.fbq("track", name, options);
  } else {
    log(`Event: ${name} - skipped (fbq not found)`, options);
  }
};

/**
 * Primary Conversion: Contact
 * Triggered when a user clicks on WhatsApp or Phone button
 */
export const trackContact = (method: "whatsapp" | "phone", providerId?: string | number) => {
  event("Contact", {
    method,
    content_ids: providerId ? [String(providerId)] : [],
    content_type: "product",
    value: method === "whatsapp" ? 1.0 : 0.5, // Arbitrary relative values for optimization
    currency: "MAD",
  });

  // Future-proof for Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "contact", {
      contact_method: method,
      provider_id: providerId,
    });
  }
};

/**
 * ViewContent: Triggered when viewing a provider profile
 */
export const trackViewContent = (providerId: string | number, category?: string) => {
  event("ViewContent", {
    content_ids: [String(providerId)],
    content_type: "product",
    content_category: category,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "view_item", {
      item_id: providerId,
      item_category: category,
    });
  }
};

/**
 * Search: Triggered when using filters
 */
export const trackSearch = (category: string, location?: string) => {
  event("Search", {
    search_string: category,
    content_category: category,
    location: location,
  });

  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "search", {
      search_term: category,
      location_id: location,
    });
  }
};

// Global type augmentation for window object
declare global {
  interface Window {
    fbq: any;
    gtag: any;
  }
}
