import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import fdcService from "../services/fdcService";
import {
  AbridgedFoodItem,
  FoodItem,
  FoodListCriteria,
  FoodSearchCriteria,
  SearchResult,
} from "../types/fdc";

interface FDCState {
  // Estados
  foods: AbridgedFoodItem[];
  searchResults: SearchResult[];
  currentFood: FoodItem | null;
  isLoading: boolean;
  error: string | null;

  // Parámetros de búsqueda y paginación
  searchCriteria: FoodSearchCriteria;
  listCriteria: FoodListCriteria;
  currentPage: number;
  totalPages: number;
  totalHits: number;

  // Acciones básicas
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Acciones de búsqueda y obtención
  searchFoods: (criteria: FoodSearchCriteria) => Promise<void>;
  getFoodById: (
    fdcId: string | number,
    format?: "abridged" | "full"
  ) => Promise<void>;
  getFoodsByIds: (
    fdcIds: (string | number)[],
    format?: "abridged" | "full"
  ) => Promise<void>;
  getFoodsList: (criteria?: FoodListCriteria) => Promise<void>;

  // Paginación
  loadNextPage: () => Promise<void>;
  loadPreviousPage: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;

  // Utilidades
  resetStore: () => void;
  clearCurrentFood: () => void;
  clearSearchResults: () => void;
  updateSearchCriteria: (criteria: Partial<FoodSearchCriteria>) => void;
  updateListCriteria: (criteria: Partial<FoodListCriteria>) => void;
}

const initialState = {
  foods: [],
  searchResults: [],
  currentFood: null,
  isLoading: false,
  error: null,
  searchCriteria: {
    query: "",
    pageSize: 25,
    pageNumber: 1,
  },
  listCriteria: {
    pageSize: 25,
    pageNumber: 1,
  },
  currentPage: 1,
  totalPages: 0,
  totalHits: 0,
};

export const useFDCStore = create<FDCState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // Acciones básicas
        setLoading: (loading) => set({ isLoading: loading }),
        setError: (error) => set({ error }),
        clearError: () => set({ error: null }),

        // Buscar alimentos
        searchFoods: async (criteria: FoodSearchCriteria) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const results = await fdcService.postSearchFoods(criteria);

            // Tomar el primer resultado (que contiene todos los datos)
            const mainResult = results[0];

            set({
              searchResults: results,
              searchCriteria: criteria,
              currentPage: mainResult?.currentPage || 1,
              totalPages: mainResult?.totalPages || 0,
              totalHits: mainResult?.totalHits || 0,
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || "Error searching foods");
            set({ isLoading: false });
          }
        },

        // Obtener alimento por ID
        getFoodById: async (
          fdcId: string | number,
          format: "abridged" | "full" = "full"
        ) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const food = await fdcService.getFoodById(fdcId, format);
            set({ currentFood: food, isLoading: false });
          } catch (error: any) {
            setError(error.message || `Error fetching food: ${fdcId}`);
            set({ isLoading: false });
          }
        },

        // Obtener múltiples alimentos por IDs
        getFoodsByIds: async (
          fdcIds: (string | number)[],
          format: "abridged" | "full" = "abridged"
        ) => {
          const { setLoading, setError } = get();

          try {
            setLoading(true);
            setError(null);

            const foods = await fdcService.getFoodsByIds(fdcIds, format);
            set({
              foods: foods as AbridgedFoodItem[],
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || "Error fetching foods by IDs");
            set({ isLoading: false });
          }
        },

        // Obtener lista de alimentos
        getFoodsList: async (criteria?: FoodListCriteria) => {
          const { setLoading, setError, listCriteria } = get();
          const finalCriteria = criteria || listCriteria;

          try {
            setLoading(true);
            setError(null);

            const foods = await fdcService.postFoodsList(finalCriteria);
            set({
              foods,
              listCriteria: finalCriteria,
              currentPage: finalCriteria.pageNumber || 1,
              isLoading: false,
            });
          } catch (error: any) {
            setError(error.message || "Error fetching foods list");
            set({ isLoading: false });
          }
        },

        // Cargar página siguiente
        loadNextPage: async () => {
          const {
            searchCriteria,
            listCriteria,
            currentPage,
            totalPages,
            searchResults,
          } = get();

          if (currentPage >= totalPages) return;

          const nextPage = currentPage + 1;

          // Si hay resultados de búsqueda, continuar con búsqueda
          if (searchResults.length > 0) {
            const newCriteria = {
              ...searchCriteria,
              pageNumber: nextPage,
            };
            await get().searchFoods(newCriteria);
          } else {
            // Si no, continuar con lista
            const newCriteria = {
              ...listCriteria,
              pageNumber: nextPage,
            };
            await get().getFoodsList(newCriteria);
          }
        },

        // Cargar página anterior
        loadPreviousPage: async () => {
          const { searchCriteria, listCriteria, currentPage, searchResults } =
            get();

          if (currentPage <= 1) return;

          const prevPage = currentPage - 1;

          // Si hay resultados de búsqueda, continuar con búsqueda
          if (searchResults.length > 0) {
            const newCriteria = {
              ...searchCriteria,
              pageNumber: prevPage,
            };
            await get().searchFoods(newCriteria);
          } else {
            // Si no, continuar con lista
            const newCriteria = {
              ...listCriteria,
              pageNumber: prevPage,
            };
            await get().getFoodsList(newCriteria);
          }
        },

        // Ir a página específica
        goToPage: async (page: number) => {
          const { searchCriteria, listCriteria, totalPages, searchResults } =
            get();

          if (page < 1 || page > totalPages) return;

          // Si hay resultados de búsqueda, continuar con búsqueda
          if (searchResults.length > 0) {
            const newCriteria = {
              ...searchCriteria,
              pageNumber: page,
            };
            await get().searchFoods(newCriteria);
          } else {
            // Si no, continuar con lista
            const newCriteria = {
              ...listCriteria,
              pageNumber: page,
            };
            await get().getFoodsList(newCriteria);
          }
        },

        // Utilidades
        resetStore: () => set(initialState),
        clearCurrentFood: () => set({ currentFood: null }),
        clearSearchResults: () =>
          set({
            searchResults: [],
            currentPage: 1,
            totalPages: 0,
            totalHits: 0,
          }),

        updateSearchCriteria: (criteria) =>
          set((state) => ({
            searchCriteria: { ...state.searchCriteria, ...criteria },
          })),

        updateListCriteria: (criteria) =>
          set((state) => ({
            listCriteria: { ...state.listCriteria, ...criteria },
          })),
      }),
      {
        name: "fdc-store",
        storage: createJSONStorage(() => AsyncStorage),
        // Solo persistir ciertos campos
        partialize: (state) => ({
          foods: state.foods.slice(0, 50), // Limitar cantidad persistida
          searchCriteria: state.searchCriteria,
          listCriteria: state.listCriteria,
          // No persistir searchResults para evitar datos obsoletos
        }),
      }
    ),
    { name: "FDCStore" }
  )
);
