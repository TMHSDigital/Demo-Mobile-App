# Changelog

## 0.2.0

### Fixed

- Settings (reminder toggle and time) now persist across app restarts via SecureStore
- Database initialization failures show a retry UI instead of hanging indefinitely
- Deleted entries now clean up their photo files from disk
- Share action sends the actual photo instead of text-only
- Notification cancellation targets the daily reminder specifically instead of clearing all scheduled notifications
- Journal grid adapts to screen size changes (rotation, split view) using `useWindowDimensions`
- Missing React hook dependency arrays in root layout and journal screen
- LayoutAnimation only triggers when entry count actually changes
- Entry IDs use `expo-crypto` UUID for collision resistance

### Added

- Expo Go graceful degradation: camera screen shows a friendly message instead of crashing
- `expo-camera` and `expo-notifications` registered as plugins in `app.json`
- `expo-crypto` dependency for secure UUID generation
- CI lint job now runs `npx expo lint` instead of duplicating type-check
- Settings persistence documented in ARCHITECTURE.md

### Removed

- Unused `updateEntry` function from `database.ts`
- Unnecessary push token fetch in notification setup (only local notifications are used)

## 0.1.0

- Initial release
- Daily photo capture with front/back camera and flash
- Journal feed with two-column grid and pull-to-refresh
- Entry detail view with share
- Optional AI photo descriptions via OpenAI Vision
- Daily reminder notifications
- SQLite persistence with Zustand state management
