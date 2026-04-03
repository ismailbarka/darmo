'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { sendGAEvent } from '@next/third-parties/google';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Only run in browser environment
    if (typeof window !== 'undefined') {
      // Construct the full URL path including query parameters
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      
      // Use sendGAEvent for page views in SPA
      // Add a defensive check to wait for dataLayer initialization
      const hasDataLayer = typeof window !== 'undefined' && (window as unknown as { dataLayer: unknown[] }).dataLayer;

      if (hasDataLayer) {
        sendGAEvent({
          event: 'page_view',
          page_path: url,
          page_location: window.location.href,
          page_title: document.title,
        });
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Analytics] Page view tracked: ${url}`);
        }
      }
    }
  }, [pathname, searchParams]);

  // This component doesn't render anything visible
  return null;
}