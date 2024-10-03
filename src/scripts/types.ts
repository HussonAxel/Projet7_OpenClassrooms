export interface Ingredient {
  ingredient: string;
  quantity?: number | string;
  unit?: string;
}

export interface Recipe {
  id: number;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  time: number;
  description: string;
  appliance: string;
  ustensils: string[];
}

export interface ActiveFilters {
  ingredients: Set<string>;
  appliances: Set<string>;
  ustensils: Set<string>;
  search: Set<string>;
}
