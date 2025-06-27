import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import fruitService from "../services/fruitService";
import { Fruit, FruitSearchParams, NutritionStats } from "../types/fruit";

interface CacheData {
  timestamp: number;
  data: any;
}

interface FruitState {
  // Estados
  fruits: Fruit[];
  currentFruit: Fruit | null;
  nutritionStats: NutritionStats | null;
  isLoading: boolean;
  error: string | null;
  searchParams: FruitSearchParams;

  // Cache timestamps
  fruitsCache: CacheData | null;
  nutritionStatsCache: CacheData | null;
  fruitByNameCache: Record<string, CacheData>;
  fruitsByFamilyCache: Record<string, CacheData>;
  fruitsByGenusCache: Record<string, CacheData>;

  // Acciones
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Acciones de frutas
  fetchAllFruits: (forceRefresh?: boolean) => Promise<void>;
  fetchFruitByName: (name: string, forceRefresh?: boolean) => Promise<void>;
  fetchFruitsByFamily: (
    family: string,
    forceRefresh?: boolean
  ) => Promise<void>;
  fetchFruitsByGenus: (genus: string, forceRefresh?: boolean) => Promise<void>;
  searchFruits: (params: FruitSearchParams) => Promise<void>;
  fetchNutritionStats: (forceRefresh?: boolean) => Promise<void>;

  // Utilidades
  resetStore: () => void;
  clearCurrentFruit: () => void;
  updateSearchParams: (params: Partial<FruitSearchParams>) => void;
  clearCache: () => void;
}

const CACHE_DURATION = 10 * 60 * 60 * 1000; // 10 horas en milisegundos

const isCacheValid = (cacheData: CacheData | null): boolean => {
  if (!cacheData) return false;
  return Date.now() - cacheData.timestamp < CACHE_DURATION;
};

const createCacheData = (data: any): CacheData => ({
  timestamp: Date.now(),
  data,
});

const initialState = {
  fruits: [],
  currentFruit: null,
  nutritionStats: null,
  isLoading: false,
  error: null,
  searchParams: {},
  fruitsCache: null,
  nutritionStatsCache: null,
  fruitByNameCache: {},
  fruitsByFamilyCache: {},
  fruitsByGenusCache: {},
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
        fetchAllFruits: async (forceRefresh = false) => {
          const { setLoading, setError, fruitsCache } = get();

          // Verificar cache si no es refresh forzado
          if (!forceRefresh && isCacheValid(fruitsCache)) {
            set({ fruits: fruitsCache!.data });
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getAllFruits();
            const cacheData = createCacheData(fruits);

            set({
              fruits,
              fruitsCache: cacheData,
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || "Error fetching fruits");
            set({ isLoading: false });
          }
        },

        // Fetch fruta por nombre
        fetchFruitByName: async (name: string, forceRefresh = false) => {
          const { setLoading, setError, fruitByNameCache } = get();

          // Verificar cache si no es refresh forzado
          if (!forceRefresh && isCacheValid(fruitByNameCache[name])) {
            set({ currentFruit: fruitByNameCache[name].data });
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const fruit = await fruitService.getFruitByName(name);
            const cacheData = createCacheData(fruit);

            set({
              currentFruit: fruit,
              fruitByNameCache: {
                ...fruitByNameCache,
                [name]: cacheData,
              },
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || `Error fetching fruit: ${name}`);
            set({ isLoading: false });
          }
        },

        // Fetch frutas por familia
        fetchFruitsByFamily: async (family: string, forceRefresh = false) => {
          const { setLoading, setError, fruitsByFamilyCache } = get();

          // Verificar cache si no es refresh forzado
          if (!forceRefresh && isCacheValid(fruitsByFamilyCache[family])) {
            set({ fruits: fruitsByFamilyCache[family].data });
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getFruitsByFamily(family);
            const cacheData = createCacheData(fruits);

            set({
              fruits,
              fruitsByFamilyCache: {
                ...fruitsByFamilyCache,
                [family]: cacheData,
              },
              isLoading: false,
            });
          } catch (error: any) {
            setError(
              error.message || `Error fetching fruits by family: ${family}`
            );
            set({ isLoading: false });
          }
        },

        // Fetch frutas por género
        fetchFruitsByGenus: async (genus: string, forceRefresh = false) => {
          const { setLoading, setError, fruitsByGenusCache } = get();

          // Verificar cache si no es refresh forzado
          if (!forceRefresh && isCacheValid(fruitsByGenusCache[genus])) {
            set({ fruits: fruitsByGenusCache[genus].data });
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const fruits = await fruitService.getFruitsByGenus(genus);
            const cacheData = createCacheData(fruits);

            set({
              fruits,
              fruitsByGenusCache: {
                ...fruitsByGenusCache,
                [genus]: cacheData,
              },
              isLoading: false,
            });
          } catch (error: any) {
            setError(
              error.message || `Error fetching fruits by genus: ${genus}`
            );
            set({ isLoading: false });
          }
        },

        // Buscar frutas (siempre hace la petición)
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
        fetchNutritionStats: async (forceRefresh = false) => {
          const { setLoading, setError, nutritionStatsCache } = get();

          // Verificar cache si no es refresh forzado
          if (!forceRefresh && isCacheValid(nutritionStatsCache)) {
            set({ nutritionStats: nutritionStatsCache!.data });
            return;
          }

          try {
            setLoading(true);
            setError(null);

            const stats = await fruitService.getNutritionStats();
            const cacheData = createCacheData(stats);

            set({
              nutritionStats: stats,
              nutritionStatsCache: cacheData,
              isLoading: false,
            });
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
        clearCache: () =>
          set({
            fruitsCache: null,
            nutritionStatsCache: null,
            fruitByNameCache: {},
            fruitsByFamilyCache: {},
            fruitsByGenusCache: {},
          }),
      }),
      {
        name: "fruit-store",
        storage: createJSONStorage(() => AsyncStorage),
        // Persistir datos y cache
        partialize: (state) => ({
          fruits: state.fruits,
          nutritionStats: state.nutritionStats,
          searchParams: state.searchParams,
          fruitsCache: state.fruitsCache,
          nutritionStatsCache: state.nutritionStatsCache,
          fruitByNameCache: state.fruitByNameCache,
          fruitsByFamilyCache: state.fruitsByFamilyCache,
          fruitsByGenusCache: state.fruitsByGenusCache,
        }),
      }
    ),
    { name: "FruitStore" }
  )
);
