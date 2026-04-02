/* eslint-disable @typescript-eslint/no-explicit-any */
export function trackEvent(eventName: string, properties: Record<string, any>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${eventName}`, properties);
  }
}
