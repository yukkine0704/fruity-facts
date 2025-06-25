import {
  ApiError,
  FruitSearchParams,
  MultipleFruitsResponse,
  NutritionStats,
  SingleFruitResponse,
} from "../types/fruit";
import apiClient from "./api";

class FruitService {
  private readonly endpoint = "fruit";
  async getAllFruits(): Promise<MultipleFruitsResponse> {
    try {
      const response = await apiClient.get<MultipleFruitsResponse>(
        `/${this.endpoint}/all`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching all fruits:", error);
      throw this.handleError(error, "Failed to fetch all fruits");
    }
  }

  async getFruitByName(name: string): Promise<SingleFruitResponse> {
    try {
      const response = await apiClient.get<SingleFruitResponse>(
        `/${this.endpoint}/${name}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching fruit ${name}:`, error);
      throw this.handleError(error, `Failed to fetch fruit: ${name}`);
    }
  }

  async getFruitsByFamily(family: string): Promise<MultipleFruitsResponse> {
    try {
      const response = await apiClient.get<MultipleFruitsResponse>(
        `/${this.endpoint}/family/${family}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching fruits by family ${family}:`, error);
      throw this.handleError(
        error,
        `Failed to fetch fruits by family: ${family}`
      );
    }
  }

  async getFruitsByGenus(genus: string): Promise<MultipleFruitsResponse> {
    try {
      const response = await apiClient.get<MultipleFruitsResponse>(
        `/${this.endpoint}/genus/${genus}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching fruits by genus ${genus}:`, error);
      throw this.handleError(
        error,
        `Failed to fetch fruits by genus: ${genus}`
      );
    }
  }

  async getFruitsByOrder(order: string): Promise<MultipleFruitsResponse> {
    try {
      const response = await apiClient.get<MultipleFruitsResponse>(
        `/${this.endpoint}/order/${order}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching fruits by order ${order}:`, error);
      throw this.handleError(
        error,
        `Failed to fetch fruits by order: ${order}`
      );
    }
  }

  async searchFruits(
    params: FruitSearchParams
  ): Promise<MultipleFruitsResponse> {
    try {
      const allFruits = await this.getAllFruits();

      return allFruits.filter((fruit) => {
        if (
          params.name &&
          !fruit.name.toLowerCase().includes(params.name.toLowerCase())
        ) {
          return false;
        }
        if (
          params.family &&
          !fruit.family.toLowerCase().includes(params.family.toLowerCase())
        ) {
          return false;
        }

        if (
          params.genus &&
          !fruit.genus.toLowerCase().includes(params.genus.toLowerCase())
        ) {
          return false;
        }

        if (
          params.order &&
          !fruit.order.toLowerCase().includes(params.order.toLowerCase())
        ) {
          return false;
        }

        const nutrition = fruit.nutritions;

        if (params.minCalories && nutrition.calories < params.minCalories)
          return false;
        if (params.maxCalories && nutrition.calories > params.maxCalories)
          return false;
        if (params.minProtein && nutrition.protein < params.minProtein)
          return false;
        if (params.maxProtein && nutrition.protein > params.maxProtein)
          return false;
        if (params.minSugar && nutrition.sugar < params.minSugar) return false;
        if (params.maxSugar && nutrition.sugar > params.maxSugar) return false;

        return true;
      });
    } catch (error) {
      console.error("Error searching fruits:", error);
      throw this.handleError(error, "Failed to search fruits");
    }
  }

  async getNutritionStats(): Promise<NutritionStats> {
    try {
      const fruits = await this.getAllFruits();

      if (fruits.length === 0) {
        throw new Error("No fruits available for statistics");
      }

      const totalCalories = fruits.reduce(
        (sum, fruit) => sum + fruit.nutritions.calories,
        0
      );
      const totalFat = fruits.reduce(
        (sum, fruit) => sum + fruit.nutritions.fat,
        0
      );
      const totalSugar = fruits.reduce(
        (sum, fruit) => sum + fruit.nutritions.sugar,
        0
      );
      const totalCarbs = fruits.reduce(
        (sum, fruit) => sum + fruit.nutritions.carbohydrates,
        0
      );
      const totalProtein = fruits.reduce(
        (sum, fruit) => sum + fruit.nutritions.protein,
        0
      );

      const count = fruits.length;

      const highestCalories = fruits.reduce((prev, current) =>
        prev.nutritions.calories > current.nutritions.calories ? prev : current
      );

      const lowestCalories = fruits.reduce((prev, current) =>
        prev.nutritions.calories < current.nutritions.calories ? prev : current
      );

      const highestProtein = fruits.reduce((prev, current) =>
        prev.nutritions.protein > current.nutritions.protein ? prev : current
      );

      const lowestSugar = fruits.reduce((prev, current) =>
        prev.nutritions.sugar < current.nutritions.sugar ? prev : current
      );

      return {
        averageCalories: Math.round((totalCalories / count) * 100) / 100,
        averageFat: Math.round((totalFat / count) * 100) / 100,
        averageSugar: Math.round((totalSugar / count) * 100) / 100,
        averageCarbohydrates: Math.round((totalCarbs / count) * 100) / 100,
        averageProtein: Math.round((totalProtein / count) * 100) / 100,
        totalFruits: count,
        highestCalories,
        lowestCalories,
        highestProtein,
        lowestSugar,
      };
    } catch (error) {
      console.error("Error calculating nutrition stats:", error);
      throw this.handleError(error, "Failed to calculate nutrition statistics");
    }
  }

  async getFruitsByCalories(
    ascending: boolean = true
  ): Promise<MultipleFruitsResponse> {
    try {
      const fruits = await this.getAllFruits();

      return fruits.sort((a, b) => {
        const diff = a.nutritions.calories - b.nutritions.calories;
        return ascending ? diff : -diff;
      });
    } catch (error) {
      console.error("Error sorting fruits by calories:", error);
      throw this.handleError(error, "Failed to sort fruits by calories");
    }
  }

  private handleError(error: any, defaultMessage: string): ApiError {
    if (error.response) {
      return {
        message: error.response.data?.message || defaultMessage,
        status: error.response.status,
        data: error.response.data,
      };
    } else if (error.request) {
      return {
        message: "Network error - no response received",
        status: 0,
      };
    } else {
      return {
        message: error.message || defaultMessage,
        status: undefined,
      };
    }
  }
}

const fruitService = new FruitService();

export default fruitService;
