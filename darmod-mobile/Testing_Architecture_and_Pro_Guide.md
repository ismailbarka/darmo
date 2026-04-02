# 🛡️ Testing Architecture & Professional Guide: cleaning-map-app-mobile

This document serves as both a **technical audit** of the current state of testing in this project and a **comprehensive manual** for all developers to follow.

---

# 📊 Part 1 — Testing Audit of This Project

I have conducted a deep scan of the current codebase. Here is the objective technical status:

### Current Testing Coverage

- **API Services**: Good baseline coverage for `providersApi.ts` and Axios client configuration.
- **Legacy Hooks**: `useGetProviders`, `useGetCategories`, and `useFilteredProviders` have solid tests.
- **Main App Screen**: The root `app/index.tsx` is **untested**.
- **Analytics Layer**: The `analytics.ts` service and event tracking logic are **untested**.
- **Shared UI Components**: `WhatsAppButton`, `CallButton`, and `DirectionsButton` are **untested**.
- **Complex Bottomsheets**: `ProviderCardBottomsheet` and `ListCardBottomsheet` are **untested**.
- **Native Modules**: No testing found for `expo-location` (GPS) or `expo-haptics` (vibration).

### Identified Problems

1.  **Mixed Hook Patterns**: The project uses both `useState + useEffect` (legacy) and `React Query` (modern). Testing `useEffect` hooks is significantly harder and more boilerplate-heavy than testing `React Query` hooks.
2.  **Missing Analytics Verification**: We are tracking critical business events (conversions, discovery), but we have no automated proof that these events actually fire when a user taps a button.
3.  **Fragile Snapshot Absence**: UI components rely on manual verification. As the project grows, unintended layout shifts in shared components won't be caught by CI.
4.  **Static Mocking**: Existing mocks are repeated across test files. There is no centralized `__mocks__` system for third-party libraries like `expo-router` or `@react-native-firebase/analytics`.

---

# 🚀 Part 2 — Changes Required for Professional Grade Testing

To transition this project to a professional standard, follow this exact roadmap:

### Step 1 — Centralize Mocks

Create a `__mocks__` directory at the root to avoid repeating `jest.mock()` blocks in every file.

- **Target**: Mock `expo-location`, `expo-haptics`, and `@react-native-firebase/analytics` once.

### Step 2 — Standardize on React Query

Migrate legacy hooks to `useQuery`.

- **Why?**: React Query hooks can be tested simply by checking if the correct API function was called, without manual `waitFor` for loading states.

### Step 3 — Implement Integration Tests for Screens

Don't just test small buttons. Test that tapping a category in `FiltersScrollView` actually filters the pins on the `MapView`.

- **File**: `app/__tests__/index.test.tsx`

### Step 4 — Verify the Analytics layer

Modify tests for components like `CallButton` and `WhatsAppButton` to assert that `trackEvent` was called with the correct parameters.

---

# 📚 Part 3 — Testing Fundamentals (For Junior Developers)

### Why do we test mobile apps?

In mobile dev, bugs are expensive. If you ship a broken button to the App Store, it takes **days** to get a fix approved and downloaded by users. Tests catch these bugs in seconds.

- **Unit Tests**: Smallest piece (a utility function like `getCategoryColor`).
- **Integration Tests**: Several pieces working together (a screen fetching data and displaying markers).
- **E2E (End-to-End) Tests**: The whole app (logging in, searching, calling a provider). _Note: Jest is for Unit/Integration; tools like Maestro are for E2E._

---

# 🔧 Part 4 — Jest Basics in This Project

Use these core functions found in your `core/hooks/__tests__/` folder:

```typescript
describe(); // Groups tests (e.g., "useGetProviders Hook")
it(); // A single test case (e.g., "should fetch data on mount")
expect(); // The assertion (e.g., expect(loading).toBe(false))
jest.mock(); // Replacing a heavy module with a "fake" one
```

---

# 📱 Part 5 — Testing React Native Components

Since we use **NativeWind (Tailwind)**, we focus on accessibility labels and text content rather than style values.

### Example: Testing `WhatsAppButton`

**File: `core/components/shared/__tests__/whatsapp-button.test.tsx`**

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import WhatsAppButton from '../whatsapp-button';
import { trackEvent } from '@/core/services/analytics';
import { Linking } from 'react-native';

jest.mock('@/core/services/analytics');
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn()
}));

const mockProvider = {
  id: 1,
  name: 'Test',
  phone: '+2126000000',
  categoryName: 'Cleaner'
};

describe('WhatsAppButton', () => {
  it('triggers analytics and opens WhatsApp when pressed', async () => {
    const { getByText } = render(<WhatsAppButton provider={mockProvider} />);
    const button = getByText('WhatsApp');

    fireEvent.press(button);

    // 1. Verify Analytics fired correctly
    expect(trackEvent).toHaveBeenCalledWith(
      'provider_whatsapp_tapped',
      expect.objectContaining({
        provider_name: 'Test'
      })
    );

    // 2. Verify external link was opened
    expect(Linking.openURL).toHaveBeenCalledWith('https://wa.me/2126000000');
  });
});
```

---

# 🎣 Part 6 — Testing Hooks (The Pro Way)

When testing hooks like `useCurrentLocation`, you must mock the `expo-location` module.

### Example: Testing `useCurrentLocation`

**File: `core/hooks/__tests__/use-current-location.test.tsx`**

```tsx
import { renderHook, waitFor } from '@testing-library/react-native';
import useCurrentLocation from '../use-current-location';
import * as Location from 'expo-location';

jest.mock('expo-location');

describe('useCurrentLocation', () => {
  it('defaults to Casablanca if permission is denied', async () => {
    (Location.requestForegroundPermissionsAsync as jest.Mock).mockResolvedValue(
      { status: 'denied' }
    );

    const { result } = renderHook(() => useCurrentLocation());

    await waitFor(() => {
      expect(result.current.region.latitude).toBe(33.583646); // Casablanca Latitude
    });
  });
});
```

---

# 🛠️ Part 7 — Standard Testing Structure

Organize your files strictly following this pattern for consistency:

```text
core/
  components/
    shared/
      call-button.tsx
      __tests__/              <-- Always use a local __tests__ folder
        call-button.test.tsx
  hooks/
    queries/
      use-providers.ts
      __tests__/
        use-providers.test.ts
```

---

# 🛑 Part 8 — Production Testing Checklist

Before opening a Pull Request (PR), ensure:

1.  ✅ **No Flaky Tests**: Run it 3 times; if it fails once, it's flaky.
2.  ✅ **Zero `console.log`**: Clean tests should be silent. Use `jest.spyOn(console, 'error').mockImplementation()` if you need to suppress intentional errors.
3.  ✅ **Analytics Tested**: Every user interaction that tracks an event MUST have a test assertion.
4.  ✅ **Deterministic Data**: Never use `new Date()` or `Math.random()` in tests. Mock them.
5.  ✅ **Coverage Check**: Run `npx jest --coverage` to see what you missed.

---

_This guide is a living document. As you add new native modules or complex features, update this guide with new patterns._
