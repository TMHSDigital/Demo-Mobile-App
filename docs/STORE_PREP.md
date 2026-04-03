# App Store Preparation

Checklist and metadata for submitting SnapLog to the Apple App Store and Google Play Store. Reference the `mobile-app-store-prep`, `mobile-ios-submission`, and `mobile-android-submission` skills from [Mobile App Developer Tools](https://github.com/TMHSDigital/Mobile-App-Developer-Tools) for step-by-step guidance.

## Pre-Submission Checklist

- [ ] App icon (1024x1024, no transparency, no rounded corners for iOS)
- [ ] Splash screen asset
- [ ] Android adaptive icon (foreground + background)
- [ ] Screenshots for all required device sizes (see below)
- [ ] Privacy policy URL
- [ ] Support URL or email
- [ ] Marketing URL (optional)
- [ ] App description (short and full)
- [ ] Keywords / tags
- [ ] Content rating questionnaire completed
- [ ] EAS Build configured and tested
- [ ] Bundle identifier matches store listing

## Screenshot Requirements

### iOS (App Store Connect)

| Device | Size (px) | Required |
|--------|-----------|----------|
| iPhone 6.9" (16 Pro Max) | 1320 x 2868 | Yes |
| iPhone 6.7" (15 Pro Max) | 1290 x 2796 | Yes |
| iPhone 6.5" (11 Pro Max) | 1284 x 2778 | Yes |
| iPad Pro 13" | 2064 x 2752 | If supporting iPad |

Minimum 3 screenshots per size, maximum 10. First screenshot is most visible in search results.

### Android (Google Play Console)

| Type | Size (px) | Required |
|------|-----------|----------|
| Phone | 1080 x 1920 min | Yes (2-8 screenshots) |
| 7" Tablet | 1080 x 1920 min | Recommended |
| 10" Tablet | 1080 x 1920 min | Recommended |

## App Store Metadata

### App Name
SnapLog - Photo Journal

### Subtitle (iOS) / Short Description (Android)
One photo a day. Your visual diary.

### Description
SnapLog is a minimalist photo journal that helps you capture one moment every day. Take a photo, add a caption, and build a beautiful visual timeline of your life.

Everything stays on your device. No accounts, no cloud, no complexity. Just your moments, organized by date.

Features:
- Daily photo capture with front/back camera
- Add captions to your photos
- Browse your journal in a beautiful grid view
- Optional AI-powered photo descriptions
- Daily reminder notifications
- Works completely offline

### Keywords (iOS)
photo, journal, diary, daily, capture, moment, offline, camera, memory

### Category
- Primary: Photo & Video
- Secondary: Lifestyle

### Content Rating
- No objectionable content
- No user-generated content sharing
- No in-app purchases
- No ads

## EAS Build

Build profiles are configured in `eas.json`:

- **development**: Internal distribution, debug build for testing
- **preview**: Internal distribution, production-like build for QA
- **production**: Store submission build

```bash
# Development build
eas build --profile development --platform ios

# Production build for store submission
eas build --profile production --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android
```
