import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import fruitService from "../services/fruitService";
import { Fruit, FruitSearchParams, NutritionStats } from "../types/fruit";

interface FruitState {
  // Estados
  fruits: Fruit[];
  currentFruit: Fruit | null;
  nutritionStats: NutritionStats | null;
  isLoading: boolean;
  error: string | null;
  searchParams: FruitSearchParams;

  // Acciones
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Acciones de frutas
  fetchAllFruits: () => Promise<void>;
  fetchFruitByName: (name: string) => Promise<void>;
  fetchFruitsByFamily: (family: string) => Promise<void>;
  fetchFruitsByGenus: (genus: string) => Promise<void>;
  searchFruits: (params: FruitSearchParams) => Promise<void>;
  fetchNutritionStats: () => Promise<void>;

  // Utilidades
  resetStore: () => void;
  clearCurrentFruit: () => void;
  updateSearchParams: (params: Partial<FruitSearchParams>) => void;
}

const initialState = {
  fruits: [],
  currentFruit: null,
  nutritionStats: null,
  isLoading: false,
  error: null,
  searchParams: {},
};

export const useFruitStore = create<FruitState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Acciones básicas
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Fetch todas las frutas
        fetchAllFruits: async () => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getAllFruits();
            set({ fruits, isLoading: false });
          } catch (error: any) {
            setError(error.message || "Error fetching fruits");
            set({ isLoading: false });
          }
        },

        // Fetch fruta por nombre
        fetchFruitByName: async (name: string) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const fruit = await fruitService.getFruitByName(name);
            set({ currentFruit: fruit, isLoading: false });
          } catch (error: any) {
            setError(error.message || `Error fetching fruit: ${name}`);
            set({ isLoading: false });
          }
        },

        // Fetch frutas por familia
        fetchFruitsByFamily: async (family: string) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getFruitsByFamily(family);
            set({ fruits, isLoading: false });
          } catch (error: any) {
            setError(
              error.message || `Error fetching fruits by family: ${family}`
            );
            set({ isLoading: false });
          }
        },

        // Fetch frutas por género
        fetchFruitsByGenus: async (genus: string) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getFruitsByGenus(genus);
            set({ fruits, isLoading: false });
          } catch (error: any) {
            setError(
              error.message || `Error fetching fruits by genus: ${genus}`
            );
            set({ isLoading: false });
          }
        },

        // Buscar frutas
        searchFruits: async (params: FruitSearchParams) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.searchFruits(params);
            set({
              fruits,
              searchParams: params,
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || "Error searching fruits");
            set({ isLoading: false });
          }
        },

        // Fetch estadísticas nutricionales
        fetchNutritionStats: async () => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const stats = await fruitService.getNutritionStats();
            set({ nutritionStats: stats, isLoading: false });
          } catch (error: any) {
            setError(error.message || "Error fetching nutrition stats");
            set({ isLoading: false });
          }
        },

        // Utilidades
        resetStore: () => set(initialState),
        clearCurrentFruit: () => set({ currentFruit: null }),
        updateSearchParams: (params) =>
          set((state) => ({
            searchParams: { ...state.searchParams, ...params },
          })),
      }),
      {
        name: "fruit-store",
        storage: createJSONStorage(() => AsyncStorage),
        // Solo persistir ciertos campos
        partialize: (state) => ({
          fruits: state.fruits,
          nutritionStats: state.nutritionStats,
          searchParams: state.searchParams,
        }),
      }
    ),
    { name: "FruitStore" }
  )
);
