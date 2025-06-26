import { Fruit } from "@/types/fruit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

interface FavoriteStats {
  totalFavorites: number;
  averageCalories: number;
  mostRecent: Fruit | null;
  oldestFavorite: Fruit | null;
}

interface FavoritesState {
  favorites: Fruit[];
  isLoading: boolean;
  error: string | null;

  // Actions
  loadFavorites: () => Promise<void>;
  addToFavorites: (fruit: Fruit) => Promise<void>;
  removeFavorite: (fruitId: string) => Promise<void>;
  isFavorite: (fruitId: string) => boolean;
  clearAllFavorites: () => Promise<void>;
  getFavoriteStats: () => FavoriteStats;
}

const FAVORITES_STORAGE_KEY = "@fruity_facts_favorites";

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  isLoading: false,
  error: null,

  loadFavorites: async () => {
    set({ isLoading: true, error: null });
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      const favorites = stored ? JSON.parse(stored) : [];
      set({ favorites, isLoading: false });
    } catch (error) {
      set({
        error: "Error al cargar favoritos",
        isLoading: false,
      });
    }
  },

  addToFavorites: async (fruit: Fruit) => {
    try {
      const { favorites } = get();
      const fruitWithDate = {
        ...fruit,
        dateAdded: new Date().toISOString(),
      };

      const newFavorites = [...favorites, fruitWithDate];
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      set({ favorites: newFavorites });
    } catch (error) {
      set({ error: "Error al agregar a favoritos" });
    }
  },

  removeFavorite: async (fruitId: string) => {
    try {
      const { favorites } = get();
      const newFavorites = favorites.filter((fruit) => fruit.id !== fruitId);
      await AsyncStorage.setItem(
        FAVORITES_STORAGE_KEY,
        JSON.stringify(newFavorites)
      );
      set({ favorites: newFavorites });
    } catch (error) {
      set({ error: "Error al eliminar de favoritos" });
    }
  },

  isFavorite: (fruitId: string) => {
    const { favorites } = get();
    return favorites.some((fruit) => fruit.id === fruitId);
  },

  clearAllFavorites: async () => {
    try {
      await AsyncStorage.removeItem(FAVORITES_STORAGE_KEY);
      set({ favorites: [] });
    } catch (error) {
      set({ error: "Error al limpiar favoritos" });
    }
  },

  getFavoriteStats: () => {
    const { favorites } = get();

    if (favorites.length === 0) {
      return {
        totalFavorites: 0,
        averageCalories: 0,
        mostRecent: null,
        oldestFavorite: null,
      };
    }

    const totalCalories = favorites.reduce(
      (sum, fruit) => sum + (fruit.nutritions.calories || 0),
      0
    );
    const averageCalories = Math.round(totalCalories / favorites.length);

    const sortedByDate = [...favorites].sort(
      (a, b) =>
        new Date((b as any).dateAdded || 0).getTime() -
        new Date((a as any).dateAdded || 0).getTime()
    );

    return {
      totalFavorites: favorites.length,
      averageCalories,
      mostRecent: sortedByDate[0] || null,
      oldestFavorite: sortedByDate[sortedByDate.length - 1] || null,
    };
  },
}));
