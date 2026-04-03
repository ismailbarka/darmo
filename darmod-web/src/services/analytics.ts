import { sendGAEvent } from '@next/third-parties/google';
import type { AnalyticsEventMap } from '@/types/analytics';

export function trackEvent<K extends keyof AnalyticsEventMap>(
  eventName: K,
  properties: AnalyticsEventMap[K]
): void {
  if (typeof window === 'undefined') return;

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }

  // Use the recommended object signature for sendGAEvent
  // Add a defensive check to wait for dataLayer initialization
  const hasDataLayer = typeof window !== 'undefined' && (window as unknown as { dataLayer: unknown[] }).dataLayer;

  if (hasDataLayer) {
    sendGAEvent({
      event: eventName,
      ...properties,
    });
  } else if (process.env.NODE_ENV === 'development') {
    console.warn(`[Analytics] Skipping ${eventName} because dataLayer is not yet initialized.`);
  }
}
