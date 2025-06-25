// Tipos básicos
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
}

export interface AbridgedFoodNutrient {
  number?: number;
  name?: string;
  amount?: number;
  unitName?: string;
  derivationCode?: string;
  derivationDescription?: string;
}

export interface Nutrient {
  id?: number;
  number?: string;
  name?: string;
  rank?: number;
  unitName?: string;
}

export interface FoodNutrientDerivation {
  id?: number;
  code?: string;
  description?: string;
  foodNutrientSource?: FoodNutrientSource;
}

export interface FoodNutrientSource {
  id?: number;
  code?: string;
  description?: string;
}

// Tipos de alimentos
export interface AbridgedFoodItem {
  fdcId: number;
  dataType: string;
  description: string;
  foodNutrients?: AbridgedFoodNutrient[];
  publicationDate?: string;
  brandOwner?: string;
  gtinUpc?: string;
  ndbNumber?: string;
  foodCode?: string;
}

export interface BrandedFoodItem extends AbridgedFoodItem {
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
  labelNutrients?: any;
}

// Criterios de búsqueda
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

export interface FoodsCriteria {
  fdcIds: number[];
  format?: "abridged" | "full";
  nutrients?: number[];
}

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

// Resultado de búsqueda
export interface SearchResult {
  foodSearchCriteria?: FoodSearchCriteria;
  totalHits?: number;
  currentPage?: number;
  totalPages?: number;
  foods?: SearchResultFood[];
}

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

export type FoodItem = AbridgedFoodItem | BrandedFoodItem;
