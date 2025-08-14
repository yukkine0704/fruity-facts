import {
  AbridgedFoodItem,
  FoodItem,
  FoodListCriteria,
  FoodsCriteria,
  FoodSearchCriteria,
  SearchResult,
} from "../types/fdc";
import { fdcApiClient } from "./api";

class FDCService {
  /**
   * Obtiene un alimento por su ID.
   * @param fdcId El ID del alimento.
   * @param format El formato de los datos a devolver ("abridged" o "full").
   * @param nutrients Una lista de IDs de nutrientes para filtrar.
   * @returns Un objeto de tipo FoodItem.
   */
  async getFoodById(
    fdcId: string | number,
    format: "abridged" | "full" = "full",
    nutrients?: number[]
  ): Promise<FoodItem> {
    const params: any = { format };

    if (nutrients && nutrients.length > 0) {
      params.nutrients = nutrients.join(",");
    }

    const response = await fdcApiClient.get(`/v1/food/${fdcId}`, { params });
    return response.data;
  }

  /**
   * Obtiene múltiples alimentos por sus IDs usando un GET.
   * @param fdcIds Un array de IDs de alimentos.
   * @param format El formato de los datos a devolver ("abridged" o "full").
   * @param nutrients Una lista de IDs de nutrientes para filtrar.
   * @returns Un array de objetos FoodItem.
   */
  async getFoodsByIds(
    fdcIds: (string | number)[],
    format: "abridged" | "full" = "full",
    nutrients?: number[]
  ): Promise<FoodItem[]> {
    const params: any = {
      fdcIds: fdcIds.join(","),
      format,
    };

    if (nutrients && nutrients.length > 0) {
      params.nutrients = nutrients.join(",");
    }

    const response = await fdcApiClient.get("/v1/foods", { params });
    return response.data;
  }

  /**
   * Obtiene múltiples alimentos por sus IDs usando un POST.
   * @param criteria Objeto con los IDs de alimentos y otros criterios.
   * @returns Un array de objetos FoodItem.
   */
  async postFoodsByIds(criteria: FoodsCriteria): Promise<FoodItem[]> {
    const response = await fdcApiClient.post("/v1/foods", criteria);
    return response.data;
  }

  /**
   * Obtiene una lista paginada de alimentos.
   * @param dataType El tipo de dato de los alimentos.
   * @param pageSize El tamaño de la página.
   * @param pageNumber El número de la página.
   * @param sortBy El campo por el cual ordenar.
   * @param sortOrder El orden de la clasificación.
   * @returns Un array de objetos AbridgedFoodItem.
   */
  async getFoodsList(
    dataType?: ("Branded" | "Foundation" | "Survey (FNDDS)" | "SR Legacy")[],
    pageSize: number = 50,
    pageNumber: number = 1,
    sortBy?:
      | "dataType.keyword"
      | "lowercaseDescription.keyword"
      | "fdcId"
      | "publishedDate",
    sortOrder?: "asc" | "desc"
  ): Promise<AbridgedFoodItem[]> {
    const params: any = {
      pageSize,
      pageNumber,
    };

    if (dataType && dataType.length > 0) {
      params.dataType = dataType.join(",");
    }

    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;

    const response = await fdcApiClient.get("/v1/foods/list", { params });
    return response.data;
  }

  /**
   * Obtiene una lista paginada de alimentos usando un POST.
   * @param criteria Objeto con los criterios de la lista.
   * @returns Un array de objetos AbridgedFoodItem.
   */
  async postFoodsList(criteria: FoodListCriteria): Promise<AbridgedFoodItem[]> {
    const response = await fdcApiClient.post("/v1/foods/list", criteria);
    return response.data;
  }

  /**
   * Obtiene una lista paginada de alimentos usando un objeto de criterios.
   * @param criteria Objeto con los criterios de la lista.
   * @returns Un array de objetos AbridgedFoodItem.
   */
  async getFoodsListByCriteria(
    criteria: FoodListCriteria
  ): Promise<AbridgedFoodItem[]> {
    const params: any = {
      pageSize: criteria.pageSize || 50,
      pageNumber: criteria.pageNumber || 1,
    };

    if (criteria.dataType && criteria.dataType.length > 0) {
      params.dataType = criteria.dataType.join(",");
    }

    if (criteria.sortBy) params.sortBy = criteria.sortBy;
    if (criteria.sortOrder) params.sortOrder = criteria.sortOrder;

    const response = await fdcApiClient.get("/v1/foods/list", { params });
    return response.data;
  }

  /**
   * Busca alimentos por una consulta de texto.
   * @param query La cadena de búsqueda.
   * @param dataType El tipo de dato de los alimentos.
   * @param pageSize El tamaño de la página.
   * @param pageNumber El número de la página.
   * @param sortBy El campo por el cual ordenar.
   * @param sortOrder El orden de la clasificación.
   * @param brandOwner El dueño de la marca (solo para alimentos de marca).
   * @returns Un objeto de tipo SearchResult que contiene los resultados.
   */
  async searchFoods(
    query: string,
    dataType?: ("Branded" | "Foundation" | "Survey (FNDDS)" | "SR Legacy")[],
    pageSize: number = 50,
    pageNumber: number = 1,
    sortBy?:
      | "dataType.keyword"
      | "lowercaseDescription.keyword"
      | "fdcId"
      | "publishedDate",
    sortOrder?: "asc" | "desc",
    brandOwner?: string
  ): Promise<SearchResult> {
    const params: any = {
      query,
      pageSize,
      pageNumber,
    };

    if (dataType && dataType.length > 0) {
      params.dataType = dataType.join(",");
    }

    if (sortBy) params.sortBy = sortBy;
    if (sortOrder) params.sortOrder = sortOrder;
    if (brandOwner) params.brandOwner = brandOwner;

    const response = await fdcApiClient.get("/v1/foods/search", { params });
    return response.data;
  }

  /**
   * Busca alimentos por criterios usando un POST.
   * @param criteria Objeto con los criterios de búsqueda.
   * @returns Un objeto de tipo SearchResult que contiene los resultados.
   */
  async postSearchFoods(criteria: FoodSearchCriteria): Promise<SearchResult> {
    const response = await fdcApiClient.post("/v1/foods/search", criteria);
    return response.data;
  }

  /**
   * Busca alimentos por criterios usando un objeto de criterios.
   * @param criteria Objeto con los criterios de búsqueda.
   * @returns Un objeto de tipo SearchResult que contiene los resultados.
   */
  async searchFoodsByCriteria(
    criteria: FoodSearchCriteria
  ): Promise<SearchResult> {
    const params: any = {
      query: criteria.query,
      pageSize: criteria.pageSize || 50,
      pageNumber: criteria.pageNumber || 1,
    };

    if (criteria.dataType && criteria.dataType.length > 0) {
      params.dataType = criteria.dataType.join(",");
    }

    if (criteria.sortBy) params.sortBy = criteria.sortBy;
    if (criteria.sortOrder) params.sortOrder = criteria.sortOrder;
    if (criteria.brandOwner) params.brandOwner = criteria.brandOwner;

    const response = await fdcApiClient.get("/v1/foods/search", { params });
    return response.data;
  }

  /**
   * Obtiene la especificación JSON de la API.
   * @returns La especificación en formato JSON.
   */
  async getJsonSpec(): Promise<any> {
    const response = await fdcApiClient.get("/v1/json-spec");
    return response.data;
  }

  /**
   * Obtiene la especificación YAML de la API.
   * @returns La especificación en formato de texto YAML.
   */
  async getYamlSpec(): Promise<string> {
    const response = await fdcApiClient.get("/v1/yaml-spec");
    return response.data;
  }
}

export const fdcService = new FDCService();
export default fdcService;
