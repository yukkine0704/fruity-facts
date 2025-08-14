import { useFDCStore } from "../stores/fdcStore";
import {
  AbridgedFoodNutrient,
  FoodItem,
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
        searchResults.foods &&
        searchResults.foods.length > 0
      ) {
        break;
      }
    }
  };

  const currentFoods = searchResults?.foods || [];
  const hasResults = !!searchResults && currentFoods.length > 0;
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  return {
    searchResults,
    searchCriteria,
    currentPage,
    totalPages,
    totalHits,
    isLoading,
    error,
    search,
    quickSearch,
    searchFruit,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    clearSearchResults,
    updateSearchCriteria,
    hasResults,
    hasNextPage,
    hasPreviousPage,
    currentFoods,
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

  // Helper para verificar si el FoodItem tiene la propiedad foodNutrients.
  // Es más simple y seguro.
  const hasFoodNutrients = (
    food: FoodItem
  ): food is FoodItem & {
    foodNutrients: (AbridgedFoodNutrient | FoodNutrient)[];
  } => {
    return (
      "foodNutrients" in food && Array.isArray((food as any).foodNutrients)
    );
  };

  // Helper para verificar el tipo de nutriente
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
    getNutrientByName: (name: string) => {
      if (!currentFood || !hasFoodNutrients(currentFood)) {
        return null;
      }

      return currentFood.foodNutrients.find((nutrient) => {
        if (isFoodNutrient(nutrient)) {
          return nutrient.nutrient?.name
            ?.toLowerCase()
            .includes(name.toLowerCase());
        } else {
          return nutrient.name?.toLowerCase().includes(name.toLowerCase());
        }
      });
    },
    getMainNutrients: () => {
      if (!currentFood || !hasFoodNutrients(currentFood)) {
        return [];
      }

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
