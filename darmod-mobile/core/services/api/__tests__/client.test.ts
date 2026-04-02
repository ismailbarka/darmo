import { api } from '../client';

describe('Axios Client Configuration', () => {
  it('should have the correct base timeout', () => {
    expect(api.defaults.timeout).toBe(10000);
  });

  it('should have application/json as the default content type', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });

  it('should use the EXPO_PUBLIC_API_URL environment variable for baseURL', () => {
    // In our test environment, we might not have the env var set, but we can verify
    // it was initialized with whatever process.env.EXPO_PUBLIC_API_URL evaluated to.
    expect(api.defaults.baseURL).toBe(process.env.EXPO_PUBLIC_API_URL);
  });
});
