export default {
  name: "VoltFinder",
  slug: "voltfinder-mobile",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.voltfinder.mobile",
    infoPlist: {
      NSLocationWhenInUseUsageDescription: "App usa sua localização para mostrar estações de carregamento próximas."
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.voltfinder.mobile",
    permissions: [
      "ACCESS_FINE_LOCATION",
      "ACCESS_COARSE_LOCATION"
    ]
  },
  web: {
    favicon: "./assets/favicon.png",
    bundler: "metro",
  },
  plugins: [
    "expo-router",
    [
      "expo-font",
      {
        fonts: ["./assets/fonts/Inter.ttf"],
      },
    ],
    "expo-localization",
    "expo-secure-store",
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  scheme: "voltfinder",
};
