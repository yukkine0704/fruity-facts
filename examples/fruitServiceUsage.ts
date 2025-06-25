import fruitService from "../services/fruitService";
import { Fruit, FruitSearchParams, NutritionStats } from "../types/fruit";

export class FruitController {
  async loadAllFruits(): Promise<Fruit[]> {
    try {
      const fruits = await fruitService.getAllFruits();
      console.log(`✅ Cargadas ${fruits.length} frutas`);
      return fruits;
    } catch (error) {
      console.error("❌ Error cargando frutas:", error);
      return [];
    }
  }

  async searchSpecificFruit(fruitName: string): Promise<Fruit | null> {
    try {
      const fruit = await fruitService.getFruitByName(fruitName);
      console.log(
        `🍎 Fruta encontrada: ${fruit.name} (${fruit.nutritions.calories} cal)`
      );
      return fruit;
    } catch (error) {
      console.error(`❌ Fruta '${fruitName}' no encontrada:`, error);
      return null;
    }
  }

  async findLowCalorieFruits(maxCalories: number = 50): Promise<Fruit[]> {
    try {
      const searchParams: FruitSearchParams = {
        maxCalories,
      };

      const fruits = await fruitService.searchFruits(searchParams);
      console.log(
        `🥗 Encontradas ${fruits.length} frutas con menos de ${maxCalories} calorías`
      );
      return fruits;
    } catch (error) {
      console.error("❌ Error buscando frutas bajas en calorías:", error);
      return [];
    }
  }

  async getHealthInsights(): Promise<NutritionStats | null> {
    try {
      const stats = await fruitService.getNutritionStats();

      console.log("📊 Estadísticas nutricionales:");
      console.log(`   • Total de frutas: ${stats.totalFruits}`);
      console.log(`   • Calorías promedio: ${stats.averageCalories}`);
      console.log(
        `   • Fruta con más calorías: ${stats.highestCalories.name} (${stats.highestCalories.nutritions.calories} cal)`
      );
      console.log(
        `   • Fruta con menos azúcar: ${stats.lowestSugar.name} (${stats.lowestSugar.nutritions.sugar}g)`
      );

      return stats;
    } catch (error) {
      console.error("❌ Error obteniendo estadísticas:", error);
      return null;
    }
  }

  async exploreFruitFamily(family: string): Promise<Fruit[]> {
    try {
      const fruits = await fruitService.getFruitsByFamily(family);
      console.log(`🌿 Frutas de la familia ${family}:`);
      fruits.forEach((fruit) => {
        console.log(`   • ${fruit.name} - ${fruit.nutritions.calories} cal`);
      });
      return fruits;
    } catch (error) {
      console.error(`❌ Error explorando familia ${family}:`, error);
      return [];
    }
  }
}
