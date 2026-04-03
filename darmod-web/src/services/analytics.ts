import { sendGAEvent } from '@next/third-parties/google';
import type { AnalyticsEventMap } from '@/types/analytics';

export function trackEvent<K extends keyof AnalyticsEventMap>(
  eventName: K,
  properties: AnalyticsEventMap[K]
): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  } else {
    sendGAEvent('event', eventName, properties);
  }
}
