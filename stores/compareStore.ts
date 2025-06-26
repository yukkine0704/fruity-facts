import { Fruit } from "@/types/fruit";
import { create } from "zustand";

interface ComparisonStats {
  totalFruits: number;
  averageCalories: number;
  highestCalories: Fruit;
  lowestCalories: Fruit;
  highestProtein: Fruit;
  highestFiber: Fruit;
  nutritionalRange: {
    calories: { min: number; max: number };
    protein: { min: number; max: number };
    carbs: { min: number; max: number };
    fat: { min: number; max: number };
  };
}

interface CompareState {
  comparedFruits: Fruit[];
  maxComparisons: number;

  // Actions
  addToComparison: (fruit: Fruit) => boolean;
  removeFromComparison: (fruitId: string) => void;
  clearComparison: () => void;
  isInComparison: (fruitId: string) => boolean;
  canAddMore: () => boolean;
  getComparisonStats: () => ComparisonStats | null;
}

export const useCompareStore = create<CompareState>((set, get) => ({
  comparedFruits: [],
  maxComparisons: 5,

  addToComparison: (fruit: Fruit) => {
    const { comparedFruits, maxComparisons } = get();

    if (comparedFruits.length >= maxComparisons) {
      return false; // No se puede agregar más
    }

    if (comparedFruits.some((f) => f.id === fruit.id)) {
      return false; // Ya está en la comparación
    }

    set({ comparedFruits: [...comparedFruits, fruit] });
    return true;
  },

  removeFromComparison: (fruitId: string) => {
    const { comparedFruits } = get();
    set({
      comparedFruits: comparedFruits.filter((fruit) => fruit.id !== fruitId),
    });
  },

  clearComparison: () => {
    set({ comparedFruits: [] });
  },

  isInComparison: (fruitId: string) => {
    const { comparedFruits } = get();
    return comparedFruits.some((fruit) => fruit.id === fruitId);
  },

  canAddMore: () => {
    const { comparedFruits, maxComparisons } = get();
    return comparedFruits.length < maxComparisons;
  },

  getComparisonStats: () => {
    const { comparedFruits } = get();

    if (comparedFruits.length === 0) {
      return null;
    }

    const calories = comparedFruits.map((f) => f.nutritions.calories || 0);
    const proteins = comparedFruits.map((f) => f.nutritions.protein || 0);
    const carbs = comparedFruits.map((f) => f.nutritions.carbohydrates || 0);
    const fats = comparedFruits.map((f) => f.nutritions.fat || 0);

    const totalCalories = calories.reduce((sum, cal) => sum + cal, 0);
    const averageCalories = Math.round(totalCalories / comparedFruits.length);

    const highestCalories = comparedFruits.reduce((prev, current) =>
      (current.nutritions.calories || 0) > (prev.nutritions.calories || 0)
        ? current
        : prev
    );

    const lowestCalories = comparedFruits.reduce((prev, current) =>
      (current.nutritions.calories || 0) < (prev.nutritions.calories || 0)
        ? current
        : prev
    );

    const highestProtein = comparedFruits.reduce((prev, current) =>
      (current.nutritions.protein || 0) > (prev.nutritions.protein || 0)
        ? current
        : prev
    );

    return {
      totalFruits: comparedFruits.length,
      averageCalories,
      highestCalories,
      lowestCalories,
      highestProtein,
      nutritionalRange: {
        calories: { min: Math.min(...calories), max: Math.max(...calories) },
        protein: { min: Math.min(...proteins), max: Math.max(...proteins) },
        carbs: { min: Math.min(...carbs), max: Math.max(...carbs) },
        fat: { min: Math.min(...fats), max: Math.max(...fats) },
      },
    };
  },
}));
