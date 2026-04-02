import analytics from '@react-native-firebase/analytics';
import type { AnalyticsEventMap } from './events';

export function trackEvent<K extends keyof AnalyticsEventMap>(
  eventName: K,
  properties: AnalyticsEventMap[K]
): void {
  if (__DEV__) {
    console.log(`[Analytics] ==================== ${eventName}`, properties);
    console.log(`[properties] ==================== `, properties);
  }

  analytics()
    .logEvent(
      eventName,
      properties as Record<string, string | number | boolean | null>
    )
    .catch(err => {
      if (__DEV__) console.warn('[Analytics] logEvent failed:', err);
    });
}
