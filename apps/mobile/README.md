# VoltFinder Mobile App

A React Native mobile application for finding electric vehicle charging stations, built with Expo, TypeScript, Tamagui, and Zod validation.

## Features

- **Modern Tech Stack**: React Native + Expo, TypeScript, Tamagui UI, Lucide Icons
- **Form Validation**: Zod schemas with React Hook Form integration
- **Navigation**: Expo Router with tab-based navigation
- **Storage**: Async storage for local data persistence
- **Responsive Design**: Tamagui design system with theme support
- **Internationalization**: i18next for multi-language support

## Tech Stack

- **Framework**: React Native with Expo (~54.0.12)
- **Language**: TypeScript (^5.1.3)
- **UI Library**: Tamagui (^1.135.0)
- **Icons**: Lucide Icons via Tamagui
- **Navigation**: Expo Router (~6.0.10)
- **Forms**: React Hook Form (^7.65.0) + Zod (^3.22.0)
- **Storage**: Async Storage (^1.23.1)
- **Animations**: React Native Reanimated (~4.1.1)

## Project Structure

```
src/
├── app/                    # Expo Router app directory
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── search.tsx     # Search screen
│   │   ├── map.tsx        # Map screen
│   │   └── profile.tsx    # Profile screen
│   ├── _layout.tsx        # Root layout
│   └── modal.tsx          # Modal screen
├── components/            # Reusable components
│   ├── FormInput.tsx      # Form input component
│   ├── Loading.tsx        # Loading components
│   └── index.ts           # Component exports
└── utils/                 # Utility functions
    ├── storage.ts         # Storage utilities
    ├── forms.ts           # Form utilities
    ├── helpers.ts         # General helpers
    └── index.ts           # Utility exports
```

## Getting Started

### Prerequisites

- Node.js (14+)
- pnpm
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Studio

### Installation

1. Navigate to the mobile app directory:

   ```bash
   cd apps/mobile
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start the development server:

   ```bash
   pnpm start
   ```

4. Run on specific platforms:

   ```bash
   # iOS (requires Mac)
   pnpm ios

   # Android
   pnpm android

   # Web
   pnpm web
   ```

## Available Scripts

- `pnpm start` - Start the Expo development server
- `pnpm android` - Run on Android device/emulator
- `pnpm ios` - Run on iOS simulator (Mac only)
- `pnpm web` - Run in web browser
- `pnpm build:android` - Build for Android
- `pnpm build:ios` - Build for iOS
- `pnpm lint` - Run ESLint
- `pnpm type-check` - Run TypeScript type checking

## Configuration

### Tamagui

The app uses Tamagui for UI components and theming. Configuration is in `tamagui.config.ts`.

### Expo

App configuration is in `app.config.js`. Update this file to modify:

- App name and description
- Bundle identifiers
- Icons and splash screens
- Permissions
- Build settings

### TypeScript

TypeScript configuration is in `tsconfig.json` with path aliases for easy imports:

- `@/*` - src directory
- `@/components/*` - components directory
- `@/utils/*` - utils directory

## Key Features

### Form Handling

The app includes utilities for form handling with Zod validation:

```tsx
import { useZodForm } from "@/utils";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const form = useZodForm(schema);
```

### Storage

Async storage wrapper for data persistence:

```tsx
import { storage, STORAGE_KEYS } from "@/utils";

// Store data
await storage.setItem(STORAGE_KEYS.USER_PROFILE, userProfile);

// Retrieve data
const profile = await storage.getItem(STORAGE_KEYS.USER_PROFILE);
```

### Components

Reusable components with TypeScript support:

```tsx
import { FormInput, Loading } from "@/components";

<FormInput
  name="email"
  label="Email"
  control={form.control}
  error={form.formState.errors.email?.message}
/>;
```

## Development Notes

- The app uses Expo Router for file-based routing
- Tamagui provides the design system and components
- All forms use Zod for validation
- Storage utilities handle data persistence
- The app is configured for both development and production builds

## Building for Production

### Android

```bash
pnpm build:android
```

### iOS

```bash
pnpm build:ios
```

Make sure to configure signing certificates and provisioning profiles in the Expo config.

## Contributing

1. Follow the existing code structure
2. Use TypeScript for all new files
3. Validate forms with Zod schemas
4. Use Tamagui components for UI
5. Add proper error handling
6. Update this README for new features
