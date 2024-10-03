import { Recipe, ActiveFilters } from "./types";
import { updateRecipesDisplay, updateTagsDisplay } from "./ui";
import { inputSearchBar, resetButton } from "./domElements";
import recipes from "../data/data.json";

export let activeFilters: ActiveFilters = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
  search: new Set(),
};

export let currentSearchTerm = "";

export function filterRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.filter((recipe) => {
    const searchMatch = Array.from(activeFilters.search).every(
      (term) =>
        recipe.name.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term) ||
        recipe.ingredients.some((ing) =>
          ing.ingredient.toLowerCase().includes(term)
        )
    );

    const ingredientMatch = Array.from(activeFilters.ingredients).every((ing) =>
      recipe.ingredients.some(
        (recipeIng) => recipeIng.ingredient.toLowerCase() === ing.toLowerCase()
      )
    );

    const applianceMatch =
      activeFilters.appliances.size === 0 ||
      activeFilters.appliances.has(recipe.appliance.toLowerCase());

    const ustensilMatch = Array.from(activeFilters.ustensils).every((ust) =>
      recipe.ustensils.some(
        (recipeUst) => recipeUst.toLowerCase() === ust.toLowerCase()
      )
    );

    return searchMatch && ingredientMatch && applianceMatch && ustensilMatch;
  });
}

export function toggleFilter(category: string, value: string) {
  const filterCategory = category
    .replace("Wrapper", "")
    .toLowerCase() as keyof typeof activeFilters;
  if (activeFilters[filterCategory].has(value.toLowerCase())) {
    removeTag(filterCategory, value);
  } else {
    addTag(filterCategory, value);
  }
}

export function addTag(category: string, value: string) {
  const filterCategory = category.toLowerCase() as keyof typeof activeFilters;
  activeFilters[filterCategory].add(value.toLowerCase());
  updateRecipesDisplay();
  updateTagsDisplay();
}

export function removeTag(category: string, value: string) {
  const filterCategory = category.toLowerCase() as keyof typeof activeFilters;
  activeFilters[filterCategory].delete(value.toLowerCase());
  updateRecipesDisplay();
  updateTagsDisplay();
}

export function clearAllInputs() {
  if (inputSearchBar) {
    inputSearchBar.value = "";
  }

  const filterInputs = document.querySelectorAll(
    ".dropdownInput"
  ) as NodeListOf<HTMLInputElement>;
  filterInputs.forEach((input) => {
    input.value = "";
    toggleCloseButton(input, false);
  });

  currentSearchTerm = "";
  resetButton.classList.add("hidden");

  activeFilters = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
    search: new Set(),
  };

  updateRecipesDisplay();
  updateTagsDisplay();
}

export function setCurrentSearchTerm(term: string) {
  currentSearchTerm = term;
}
export function filterDropdownOptions(category: string, searchTerm: string) {
  const wrapper = document.getElementById(`${category}Wrapper`);
  if (wrapper) {
    const options = Array.from(wrapper.children) as HTMLElement[];
    options.forEach((option) => {
      if (
        option.textContent &&
        option.textContent.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        option.style.display = "";
      } else {
        option.style.display = "none";
      }
    });
  }
}

function toggleCloseButton(input: HTMLInputElement, show: boolean) {
  const closeButton = input.parentElement?.querySelector("svg");
  if (closeButton) {
    if (show) {
      closeButton.classList.remove("hidden");
    } else {
      closeButton.classList.add("hidden");
    }
  }
}
