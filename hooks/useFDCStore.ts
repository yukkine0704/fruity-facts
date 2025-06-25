import { useFDCStore } from "../stores/fdcStore";
import { FoodListCriteria, FoodSearchCriteria } from "../types/fdc";

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
    await getFoodById(fdcId, format);
  };

  return {
    currentFood,
    isLoading,
    error,
    loadFood,
    clearCurrentFood,
    hasFood: currentFood !== null,
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
