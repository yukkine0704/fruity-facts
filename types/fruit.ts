export interface Nutritions {
  calories: number;
  fat: number;
  sugar: number;
  carbohydrates: number;
  protein: number;
}

export interface Fruit {
  id: number;
  name: string;
  family: string;
  order: string;
  genus: string;
  nutritions: Nutritions;
  dateAdded?: Date;
}

export type SingleFruitResponse = Fruit;
export type MultipleFruitsResponse = Fruit[];

export interface FruitSearchParams {
  name?: string;
  family?: string;
  genus?: string;
  order?: string;
  minCalories?: number;
  maxCalories?: number;
  minProtein?: number;
  maxProtein?: number;
  minSugar?: number;
  maxSugar?: number;
}

export interface NutritionStats {
  averageCalories: number;
  averageFat: number;
  averageSugar: number;
  averageCarbohydrates: number;
  averageProtein: number;
  totalFruits: number;
  highestCalories: Fruit;
  lowestCalories: Fruit;
  highestProtein: Fruit;
  lowestSugar: Fruit;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

export interface FruitApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  timestamp: string;
}
