import {
  AbridgedFoodItem,
  FoodItem,
  FoodListCriteria,
  FoodSearchCriteria,
  FoodsCriteria,
  SearchResult,
} from "../types/fdc";
import { fdcApiClient } from "./api";

class FDCService {
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

  async postFoodsByIds(criteria: FoodsCriteria): Promise<FoodItem[]> {
    const response = await fdcApiClient.post("/v1/foods", criteria);
    return response.data;
  }

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

  async postFoodsList(criteria: FoodListCriteria): Promise<AbridgedFoodItem[]> {
    const response = await fdcApiClient.post("/v1/foods/list", criteria);
    return response.data;
  }

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
  ): Promise<SearchResult[]> {
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

  async postSearchFoods(criteria: FoodSearchCriteria): Promise<SearchResult[]> {
    const response = await fdcApiClient.post("/v1/foods/search", criteria);
    return response.data;
  }

  async getJsonSpec(): Promise<any> {
    const response = await fdcApiClient.get("/v1/json-spec");
    return response.data;
  }

  async getYamlSpec(): Promise<string> {
    const response = await fdcApiClient.get("/v1/yaml-spec");
    return response.data;
  }
}

export const fdcService = new FDCService();
export default fdcService;
