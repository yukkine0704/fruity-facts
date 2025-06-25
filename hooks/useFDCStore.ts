import { useFDCStore } from "../stores/fdcStore";
import {
  AbridgedFoodNutrient,
  FoodListCriteria,
  FoodNutrient,
  FoodSearchCriteria,
} from "../types/fdc";

export const useFoodSearch = () => {
  const {
    searchResults,
    searchCriteria,
    currentPage,
    totalPages,
    totalHits,
    isLoading,
    error,
    searchFoods,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    clearSearchResults,
    updateSearchCriteria,
  } = useFDCStore();

  const search = async (
    query: string,
    options?: Partial<FoodSearchCriteria>
  ) => {
    const criteria: FoodSearchCriteria = {
      ...searchCriteria,
      query,
      pageNumber: 1,
      ...options,
    };

    await searchFoods(criteria);
  };

  const quickSearch = async (query: string) => {
    await search(query, {
      dataType: ["Branded", "Foundation"],
      pageSize: 20,
      sortBy: "lowercaseDescription.keyword",
      sortOrder: "asc",
    });
  };

  const searchFruit = async (fruitName: string) => {
    // Intentar múltiples variaciones del nombre de la fruta
    const searchTerms = [
      fruitName,
      `${fruitName} fresh`,
      `${fruitName} raw`,
      `fresh ${fruitName}`,
      `raw ${fruitName}`,
    ];

    for (const term of searchTerms) {
      await search(term, {
        dataType: ["Foundation", "Branded"],
        pageSize: 10,
        sortBy: "lowercaseDescription.keyword",
        sortOrder: "asc",
      });

      if (
        searchResults &&
        searchResults.length > 0 &&
        searchResults[0]?.foods &&
        searchResults[0].foods.length > 0
      ) {
        break;
      }
    }
  };

  return {
    // Estados
    searchResults,
    searchCriteria,
    currentPage,
    totalPages,
    totalHits,
    isLoading,
    error,
    // Acciones
    search,
    quickSearch,
    searchFruit,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    clearSearchResults,
    updateSearchCriteria,
    // Utilidades
    hasResults: searchResults.length > 0,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    currentFoods: searchResults[0]?.foods || [],
  };
};

export const useFoodDetails = () => {
  const { currentFood, isLoading, error, getFoodById, clearCurrentFood } =
    useFDCStore();

  const loadFood = async (
    fdcId: string | number,
    format: "abridged" | "full" = "full"
  ) => {
    try {
      await getFoodById(fdcId, format);
    } catch (err) {
      console.error("Error loading food details:", err);
      throw err;
    }
  };

  // Helper function para verificar si un nutriente es del tipo FoodNutrient
  const isFoodNutrient = (
    nutrient: AbridgedFoodNutrient | FoodNutrient
  ): nutrient is FoodNutrient => {
    return "nutrient" in nutrient;
  };

  return {
    currentFood,
    isLoading,
    error,
    loadFood,
    clearCurrentFood,
    hasFood: currentFood !== null,
    // Utilidades para mostrar información
    getNutrientByName: (name: string) => {
      if (!currentFood?.foodNutrients) return null;

      return currentFood.foodNutrients.find((nutrient) => {
        if (isFoodNutrient(nutrient)) {
          return nutrient.nutrient?.name
            ?.toLowerCase()
            .includes(name.toLowerCase());
        } else {
          // Para AbridgedFoodNutrient, usar la propiedad 'name' directamente
          return nutrient.name?.toLowerCase().includes(name.toLowerCase());
        }
      });
    },
    getMainNutrients: () => {
      if (!currentFood?.foodNutrients) return [];

      const mainNutrients = [
        "Energy",
        "Protein",
        "Total lipid (fat)",
        "Carbohydrate, by difference",
        "Fiber, total dietary",
        "Sugars, total including NLEA",
        "Calcium, Ca",
        "Iron, Fe",
        "Sodium, Na",
        "Vitamin C, total ascorbic acid",
      ];

      return currentFood.foodNutrients.filter((nutrient) => {
        if (isFoodNutrient(nutrient)) {
          return mainNutrients.some((main) =>
            nutrient.nutrient?.name?.includes(main)
          );
        } else {
          // Para AbridgedFoodNutrient
          return mainNutrients.some((main) => nutrient.name?.includes(main));
        }
      });
    },
  };
};

export const useFoodsList = () => {
  const {
    foods,
    listCriteria,
    currentPage,
    totalPages,
    isLoading,
    error,
    getFoodsList,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    updateListCriteria,
  } = useFDCStore();

  const loadList = async (options?: Partial<FoodListCriteria>) => {
    const criteria: FoodListCriteria = {
      ...listCriteria,
      pageNumber: 1,
      ...options,
    };

    await getFoodsList(criteria);
  };

  const loadBrandedFoods = async (pageSize: number = 25) => {
    await loadList({
      dataType: ["Branded"],
      pageSize,
      sortBy: "lowercaseDescription.keyword",
      sortOrder: "asc",
    });
  };

  const loadFoundationFoods = async (pageSize: number = 25) => {
    await loadList({
      dataType: ["Foundation"],
      pageSize,
      sortBy: "lowercaseDescription.keyword",
      sortOrder: "asc",
    });
  };

  return {
    foods,
    listCriteria,
    currentPage,
    totalPages,
    isLoading,
    error,
    loadList,
    loadBrandedFoods,
    loadFoundationFoods,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    updateListCriteria,
    hasFoods: foods.length > 0,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
  };
};
