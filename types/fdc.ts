// ========================================================================
// Tipos de nutrientes
// ========================================================================

/**
 * Representa un nutriente de un alimento.
 * Se utiliza para los tipos de alimentos "Branded", "Foundation" y "SRLegacy".
 */
export interface FoodNutrient {
  id?: number;
  amount?: number;
  dataPoints?: number;
  min?: number;
  max?: number;
  median?: number;
  type?: string;
  nutrient?: Nutrient;
  foodNutrientDerivation?: FoodNutrientDerivation;
  nutrientAnalysisDetails?: NutrientAnalysisDetails;
}

/**
 * Representa un nutriente en formato abreviado.
 * Se utiliza en las búsquedas y en el tipo de alimento "Abridged".
 */
export interface AbridgedFoodNutrient {
  number?: number;
  name?: string;
  amount?: number;
  unitName?: string;
  derivationCode?: string;
  derivationDescription?: string;
}

/**
 * Representa los detalles de un nutriente.
 */
export interface Nutrient {
  id?: number;
  number?: string;
  name?: string;
  rank?: number;
  unitName?: string;
}

/**
 * Describe la derivación de un nutriente.
 */
export interface FoodNutrientDerivation {
  id?: number;
  code?: string;
  description?: string;
  foodNutrientSource?: FoodNutrientSource;
}

/**
 * Describe la fuente del nutriente.
 */
export interface FoodNutrientSource {
  id?: number;
  code?: string;
  description?: string;
}

/**
 * Detalles del análisis del nutriente.
 */
export interface NutrientAnalysisDetails {
  subSampleId?: number;
  amount?: number;
  nutrientId?: number;
  labMethodDescription?: string;
  labMethodOriginalDescription?: string;
  labMethodLink?: string;
  labMethodTechnique?: string;
  nutrientAcquisitionDetails?: NutrientAcquisitionDetails[];
}

/**
 * Detalles de la adquisición del nutriente.
 */
export interface NutrientAcquisitionDetails {
  sampleUnitId?: number;
  purchaseDate?: string;
  storeCity?: string;
  storeState?: string;
}

// ========================================================================
// Tipos de alimentos base y específicos
// ========================================================================

/**
 * Interfaz base que comparten todos los tipos de alimentos.
 */
export interface BaseFoodItem {
  fdcId: number;
  dataType: string;
  description: string;
  publicationDate?: string;
}

/**
 * Tipo de alimento abreviado.
 */
export interface AbridgedFoodItem extends BaseFoodItem {
  foodNutrients?: AbridgedFoodNutrient[];
  brandOwner?: string;
  gtinUpc?: string;
  ndbNumber?: string;
  foodCode?: string;
}

/**
 * Tipo de alimento de marca.
 */
export interface BrandedFoodItem extends BaseFoodItem {
  availableDate?: string;
  brandOwner?: string;
  dataSource?: string;
  foodClass?: string;
  gtinUpc?: string;
  householdServingFullText?: string;
  ingredients?: string;
  modifiedDate?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  brandedFoodCategory?: string;
  foodNutrients?: FoodNutrient[];
  foodUpdateLog?: FoodUpdateLog[];
  labelNutrients?: {
    fat?: { value?: number };
    saturatedFat?: { value?: number };
    transFat?: { value?: number };
    cholesterol?: { value?: number };
    sodium?: { value?: number };
    carbohydrates?: { value?: number };
    fiber?: { value?: number };
    sugars?: { value?: number };
    protein?: { value?: number };
    calcium?: { value?: number };
    iron?: { value?: number };
    postassium?: { value?: number };
    calories?: { value?: number };
  };
}

/**
 * Tipo de alimento 'Foundation'.
 */
export interface FoundationFoodItem extends BaseFoodItem {
  foodClass?: string;
  footNote?: string;
  isHistoricalReference?: boolean;
  ndbNumber?: string;
  scientificName?: string;
  foodCategory?: FoodCategory;
  foodComponents?: FoodComponent[];
  foodNutrients?: FoodNutrient[];
  foodPortions?: FoodPortion[];
  inputFoods?: InputFoodFoundation[];
  nutrientConversionFactors?: NutrientConversionFactors[];
}

/**
 * Tipo de alimento 'SRLegacy'.
 */
export interface SRLegacyFoodItem extends BaseFoodItem {
  foodClass?: string;
  isHistoricalReference?: boolean;
  ndbNumber?: string;
  scientificName?: string;
  foodCategory?: FoodCategory;
  foodNutrients?: FoodNutrient[];
  nutrientConversionFactors?: NutrientConversionFactors[];
}

/**
 * Tipo de alimento 'Survey (FNDDS)'.
 */
export interface SurveyFoodItem extends BaseFoodItem {
  datatype?: string;
  endDate?: string;
  foodClass?: string;
  foodCode?: string;
  startDate?: string;
  foodAttributes?: FoodAttribute[];
  foodPortions?: FoodPortion[];
  inputFoods?: InputFoodSurvey[];
  wweiaFoodCategory?: WweiaFoodCategory;
}

/**
 * Tipo de alimento 'Sample'.
 */
export interface SampleFoodItem extends BaseFoodItem {
  datatype?: string;
  foodClass?: string;
  foodAttributes?: FoodCategory[];
}

/**
 * Define los factores de conversión de nutrientes.
 */
export interface NutrientConversionFactors {
  id?: number;
  type?: string;
  value?: number;
}

// ========================================================================
// Tipos auxiliares para alimentos
// ========================================================================

/**
 * Categoría de un alimento.
 */
export interface FoodCategory {
  id?: number;
  code?: string;
  description?: string;
}

/**
 * Componente de un alimento.
 */
export interface FoodComponent {
  id?: number;
  name?: string;
  dataPoints?: number;
  gramWeight?: number;
  isRefuse?: boolean;
  minYearAcquired?: number;
  percentWeight?: number;
}

/**
 * Porción de un alimento.
 */
export interface FoodPortion {
  id?: number;
  amount?: number;
  dataPoints?: number;
  gramWeight?: number;
  minYearAcquired?: number;
  modifier?: string;
  portionDescription?: string;
  sequenceNumber?: number;
  measureUnit?: MeasureUnit;
}

/**
 * Unidad de medida.
 */
export interface MeasureUnit {
  id?: number;
  abbreviation?: string;
  name?: string;
}

/**
 * Ingrediente de un alimento 'Foundation'.
 */
export interface InputFoodFoundation {
  id?: number;
  foodDescription?: string;
  inputFood?: SampleFoodItem;
}

/**
 * Ingrediente de un alimento 'Survey'.
 */
export interface InputFoodSurvey {
  id?: number;
  amount?: number;
  foodDescription?: string;
  ingredientCode?: number;
  ingredientDescription?: string;
  ingredientWeight?: number;
  portionCode?: string;
  portionDescription?: string;
  sequenceNumber?: number;
  surveyFlag?: number;
  unit?: string;
  inputFood?: SurveyFoodItem;
  retentionFactor?: RetentionFactor;
}

/**
 * Factor de retención.
 */
export interface RetentionFactor {
  id?: number;
  code?: number;
  description?: string;
}

/**
 * Categoría de alimentos Wweia.
 */
export interface WweiaFoodCategory {
  wweiaFoodCategoryCode?: number;
  wweiaFoodCategoryDescription?: string;
}

/**
 * Atributo de un alimento.
 */
export interface FoodAttribute {
  id?: number;
  sequenceNumber?: number;
  value?: string;
  FoodAttributeType?: {
    id?: number;
    name?: string;
    description?: string;
  };
}

/**
 * Log de actualización de un alimento.
 */
export interface FoodUpdateLog {
  fdcId?: number;
  availableDate?: string;
  brandOwner?: string;
  dataSource?: string;
  dataType?: string;
  description?: string;
  foodClass?: string;
  gtinUpc?: string;
  householdServingFullText?: string;
  ingredients?: string;
  modifiedDate?: string;
  publicationDate?: string;
  servingSize?: number;
  servingSizeUnit?: string;
  brandedFoodCategory?: string;
  changes?: string;
  foodAttributes?: FoodAttribute[];
}

// ========================================================================
// Tipos de criterios de búsqueda
// ========================================================================

/**
 * Criterios para la búsqueda de alimentos.
 */
export interface FoodSearchCriteria {
  query: string;
  dataType?: ("Branded" | "Foundation" | "Survey (FNDDS)" | "SR Legacy")[];
  pageSize?: number;
  pageNumber?: number;
  sortBy?:
    | "dataType.keyword"
    | "lowercaseDescription.keyword"
    | "fdcId"
    | "publishedDate";
  sortOrder?: "asc" | "desc";
  brandOwner?: string;
}

/**
 * Criterios para obtener múltiples alimentos por ID.
 */
export interface FoodsCriteria {
  fdcIds: number[];
  format?: "abridged" | "full";
  nutrients?: number[];
}

/**
 * Criterios para obtener una lista paginada de alimentos.
 */
export interface FoodListCriteria {
  dataType?: ("Branded" | "Foundation" | "Survey (FNDDS)" | "SR Legacy")[];
  pageSize?: number;
  pageNumber?: number;
  sortBy?:
    | "dataType.keyword"
    | "lowercaseDescription.keyword"
    | "fdcId"
    | "publishedDate";
  sortOrder?: "asc" | "desc";
}

// ========================================================================
// Tipos de resultados de la API
// ========================================================================

/**
 * Resultado de una búsqueda de alimentos.
 */
export interface SearchResult {
  foodSearchCriteria?: FoodSearchCriteria;
  totalHits?: number;
  currentPage?: number;
  totalPages?: number;
  foods?: SearchResultFood[];
}

/**
 * Un alimento en el resultado de una búsqueda.
 */
export interface SearchResultFood {
  fdcId: number;
  dataType?: string;
  description: string;
  foodCode?: string;
  foodNutrients?: AbridgedFoodNutrient[];
  publicationDate?: string;
  scientificName?: string;
  brandOwner?: string;
  gtinUpc?: string;
  ingredients?: string;
  ndbNumber?: string;
  additionalDescriptions?: string;
  allHighlightFields?: string;
  score?: number;
}

// ========================================================================
// Tipos unión y Type Guards
// ========================================================================

/**
 * Tipo unión para todos los posibles tipos de alimentos devueltos por la API.
 */
export type FoodItem =
  | AbridgedFoodItem
  | BrandedFoodItem
  | FoundationFoodItem
  | SRLegacyFoodItem
  | SurveyFoodItem;

/**
 * Verifica si un `FoodItem` es de tipo `BrandedFoodItem`.
 * @param food El objeto de alimento a verificar.
 * @returns `true` si es un `BrandedFoodItem`, `false` en caso contrario.
 */
export const isBrandedFoodItem = (food: FoodItem): food is BrandedFoodItem => {
  return food.dataType === "Branded";
};

/**
 * Verifica si un `FoodItem` es de tipo `FoundationFoodItem`.
 * @param food El objeto de alimento a verificar.
 * @returns `true` si es un `FoundationFoodItem`, `false` en caso contrario.
 */
export const isFoundationFoodItem = (
  food: FoodItem
): food is FoundationFoodItem => {
  return food.dataType === "Foundation";
};

/**
 * Verifica si un `FoodItem` es de tipo `SRLegacyFoodItem`.
 * @param food El objeto de alimento a verificar.
 * @returns `true` si es un `SRLegacyFoodItem`, `false` en caso contrario.
 */
export const isSRLegacyFoodItem = (
  food: FoodItem
): food is SRLegacyFoodItem => {
  return food.dataType === "SR Legacy";
};

/**
 * Verifica si un `FoodItem` es de tipo `SurveyFoodItem`.
 * @param food El objeto de alimento a verificar.
 * @returns `true` si es un `SurveyFoodItem`, `false` en caso contrario.
 */
export const isSurveyFoodItem = (food: FoodItem): food is SurveyFoodItem => {
  return food.dataType === "Survey (FNDDS)";
};

/**
 * Verifica si un `FoodItem` es de tipo `AbridgedFoodItem`.
 * @param food El objeto de alimento a verificar.
 * @returns `true` si es un `AbridgedFoodItem`, `false` en caso contrario.
 */
export const isAbridgedFoodItem = (
  food: FoodItem
): food is AbridgedFoodItem => {
  return (
    !isBrandedFoodItem(food) &&
    !isFoundationFoodItem(food) &&
    !isSRLegacyFoodItem(food) &&
    !isSurveyFoodItem(food)
  );
};
