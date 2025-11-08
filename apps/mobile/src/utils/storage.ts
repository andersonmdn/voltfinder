import AsyncStorage from "@react-native-async-storage/async-storage";

export const storage = {
  // Get item from storage
  async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error("Error getting item from storage:", error);
      return null;
    }
  },

  // Set item in storage
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item in storage:", error);
    }
  },

  // Remove item from storage
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing item from storage:", error);
    }
  },

  // Clear all storage
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },

  // Get multiple items
  async getMultiple(keys: string[]): Promise<Record<string, any>> {
    try {
      const values = await AsyncStorage.multiGet(keys);
      const result: Record<string, any> = {};

      values.forEach(([key, value]) => {
        if (value) {
          try {
            result[key] = JSON.parse(value);
          } catch {
            result[key] = value;
          }
        }
      });

      return result;
    } catch (error) {
      console.error("Error getting multiple items from storage:", error);
      return {};
    }
  },
};

// Storage keys constants
export const STORAGE_KEYS = {
  USER_TOKEN: "user_token",
  USER_PROFILE: "user_profile",
  FAVORITE_STATIONS: "favorite_stations",
  RECENT_SEARCHES: "recent_searches",
  APP_SETTINGS: "app_settings",
  ONBOARDING_COMPLETED: "onboarding_completed",
} as const;
