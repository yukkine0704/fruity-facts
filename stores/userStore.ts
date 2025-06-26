import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  joinDate: string;
  preferences?: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    autoSearch: boolean;
  };
}

export interface UserStats {
  totalFruitsViewed: number;
  totalFavorites: number;
  totalSearches: number;
  daysActive: number;
  lastActiveDate: string;
  fruitsViewedToday: number;
  searchesToday: number;
}

export interface UserActivity {
  date: string;
  fruitsViewed: string[]; // Array of fruit names
  searches: string[]; // Array of search queries
  favoritesAdded: string[]; // Array of fruit names
  favoritesRemoved: string[]; // Array of fruit names
}

interface UserStore {
  // State
  user: User | null;
  stats: UserStats;
  activities: UserActivity[];
  isLoading: boolean;
  error: string | null;

  // Actions
  initializeUser: (name?: string) => void;
  updateUserName: (name: string) => void;
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => void;

  // Stats actions
  getUserStats: () => UserStats;
  incrementFruitsViewed: (fruitName: string) => void;
  incrementSearches: (query: string) => void;
  updateFavoritesCount: (count: number) => void;

  // Activity tracking
  trackActivity: (
    type: "view" | "search" | "favorite_add" | "favorite_remove",
    data: string
  ) => void;
  getActivityByDate: (date: string) => UserActivity | undefined;

  // Data management
  exportUserData: () => Promise<string>;
  clearUserData: () => void;

  // Utility
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const generateUserId = (): string => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};

const getDefaultStats = (): UserStats => ({
  totalFruitsViewed: 0,
  totalFavorites: 0,
  totalSearches: 0,
  daysActive: 1,
  lastActiveDate: getTodayString(),
  fruitsViewedToday: 0,
  searchesToday: 0,
});

const getDefaultUser = (name?: string): User => ({
  id: generateUserId(),
  name: name || "Usuario",
  joinDate: new Date().toISOString(),
  preferences: {
    theme: "system",
    notifications: false,
    autoSearch: true,
  },
});

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      stats: getDefaultStats(),
      activities: [],
      isLoading: false,
      error: null,

      // Initialize user
      initializeUser: (name?: string) => {
        const existingUser = get().user;
        if (!existingUser) {
          const newUser = getDefaultUser(name);
          set({
            user: newUser,
            stats: getDefaultStats(),
            activities: [],
          });
        }
      },

      // Update user name
      updateUserName: (name: string) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: {
              ...currentUser,
              name: name.trim(),
            },
          });
        }
      },

      // ✅ Update user preferences - CORREGIDO
      updateUserPreferences: (preferences) => {
        const currentUser = get().user;
        if (currentUser && currentUser.preferences) {
          set({
            user: {
              ...currentUser,
              preferences: {
                ...currentUser.preferences, // Mantener valores existentes
                ...preferences, // Sobrescribir solo los valores proporcionados
              },
            },
          });
        } else if (currentUser) {
          // Si no hay preferences existentes, crear con valores por defecto
          const defaultPreferences = {
            theme: "system" as const,
            notifications: false,
            autoSearch: true,
          };

          set({
            user: {
              ...currentUser,
              preferences: {
                ...defaultPreferences,
                ...preferences,
              },
            },
          });
        }
      },

      // Get user stats
      getUserStats: () => {
        const { stats, activities, user } = get();
        const today = getTodayString();

        // Calculate days active
        const uniqueDates = new Set(
          activities.map((activity) => activity.date)
        );
        const daysActive = Math.max(1, uniqueDates.size);

        // Calculate days since joining
        const joinDate = user?.joinDate ? new Date(user.joinDate) : new Date();
        const daysSinceJoining = Math.max(
          1,
          Math.ceil((Date.now() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
        );

        return {
          ...stats,
          daysActive: Math.min(daysActive, daysSinceJoining),
        };
      },

      // Increment fruits viewed
      incrementFruitsViewed: (fruitName: string) => {
        const { stats, activities } = get();
        const today = getTodayString();

        // Update stats
        const newStats = {
          ...stats,
          totalFruitsViewed: stats.totalFruitsViewed + 1,
          lastActiveDate: today,
          fruitsViewedToday:
            stats.lastActiveDate === today ? stats.fruitsViewedToday + 1 : 1,
        };

        // Track activity
        get().trackActivity("view", fruitName);

        set({ stats: newStats });
      },

      // Increment searches
      incrementSearches: (query: string) => {
        const { stats } = get();
        const today = getTodayString();

        const newStats = {
          ...stats,
          totalSearches: stats.totalSearches + 1,
          lastActiveDate: today,
          searchesToday:
            stats.lastActiveDate === today ? stats.searchesToday + 1 : 1,
        };

        // Track activity
        get().trackActivity("search", query);

        set({ stats: newStats });
      },

      // Update favorites count
      updateFavoritesCount: (count: number) => {
        const { stats } = get();
        set({
          stats: {
            ...stats,
            totalFavorites: count,
          },
        });
      },

      // Track activity
      trackActivity: (type, data) => {
        const { activities } = get();
        const today = getTodayString();

        let todayActivity = activities.find(
          (activity) => activity.date === today
        );

        if (!todayActivity) {
          todayActivity = {
            date: today,
            fruitsViewed: [],
            searches: [],
            favoritesAdded: [],
            favoritesRemoved: [],
          };
        }

        // Update activity based on type
        switch (type) {
          case "view":
            if (!todayActivity.fruitsViewed.includes(data)) {
              todayActivity.fruitsViewed.push(data);
            }
            break;
          case "search":
            todayActivity.searches.push(data);
            break;
          case "favorite_add":
            if (!todayActivity.favoritesAdded.includes(data)) {
              todayActivity.favoritesAdded.push(data);
            }
            break;
          case "favorite_remove":
            if (!todayActivity.favoritesRemoved.includes(data)) {
              todayActivity.favoritesRemoved.push(data);
            }
            break;
        }

        // Update activities array
        const updatedActivities = activities.filter(
          (activity) => activity.date !== today
        );
        updatedActivities.push(todayActivity);

        // Keep only last 30 days of activities
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const filteredActivities = updatedActivities.filter(
          (activity) => new Date(activity.date) >= thirtyDaysAgo
        );

        set({ activities: filteredActivities });
      },

      // Get activity by date
      getActivityByDate: (date: string) => {
        const { activities } = get();
        return activities.find((activity) => activity.date === date);
      },

      // Export user data
      exportUserData: async () => {
        const { user, stats, activities } = get();

        const exportData = {
          user,
          stats: get().getUserStats(),
          activities,
          exportDate: new Date().toISOString(),
          version: "1.0.0",
        };

        return JSON.stringify(exportData, null, 2);
      },

      // Clear user data
      clearUserData: () => {
        set({
          user: null,
          stats: getDefaultStats(),
          activities: [],
          error: null,
        });
      },

      // Utility functions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },
    }),
    {
      name: "fruity-facts-user-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        stats: state.stats,
        activities: state.activities,
      }),
    }
  )
);

// Hook para inicializar el usuario automáticamente
export const useInitializeUser = () => {
  const { user, initializeUser } = useUserStore();

  React.useEffect(() => {
    if (!user) {
      initializeUser();
    }
  }, [user, initializeUser]);

  return user;
};
