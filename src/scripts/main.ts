import recipes from "../data/data.json";
import { Recipe, ActiveFilters } from "./types";
import { initializeEventListeners } from "./eventListeners";
import { updateRecipesDisplay } from "./search";

const activeFilters: ActiveFilters = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
  search: new Set(),
};

// Initialize event listeners
initializeEventListeners(recipes, activeFilters);

// Initial display of recipes
updateRecipesDisplay(recipes, activeFilters);
