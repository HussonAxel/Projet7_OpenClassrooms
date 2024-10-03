import { Recipe, ActiveFilters } from "./types";
import { createElementWithClass } from "./utils";
import ComponentsClasses from "../components/ComponentsClasses";
import { toggleFilter } from "./index";


export function filterRecipes(
  recipes: Recipe[],
  activeFilters: ActiveFilters
): Recipe[] {
  const filteredRecipes: Recipe[] = [];

  for (let i = 0; i < recipes.length; i++) {
    const recipe = recipes[i];
    let searchMatch = true;
    let ingredientMatch = true;
    let applianceMatch = true;
    let ustensilMatch = true;

    // Check search match
    if (activeFilters.search.size > 0) {
      searchMatch = Array.from(activeFilters.search).every(
        (term) =>
          recipe.name.toLowerCase().includes(term.toLowerCase()) ||
          recipe.description.toLowerCase().includes(term.toLowerCase()) ||
          recipe.ingredients.some((ing) =>
            ing.ingredient.toLowerCase().includes(term.toLowerCase())
          )
      );
    }

    // Check ingredient match
    const ingredientFilters = Array.from(activeFilters.ingredients);
    for (let j = 0; j < ingredientFilters.length; j++) {
      const ing = ingredientFilters[j];
      if (
        !recipe.ingredients.some(
          (ingredient) =>
            ingredient.ingredient.toLowerCase() === ing.toLowerCase()
        )
      ) {
        ingredientMatch = false;
        break;
      }
    }

    // Check appliance match
    if (activeFilters.appliances.size > 0) {
      applianceMatch = activeFilters.appliances.has(
        recipe.appliance.toLowerCase()
      );
    }

    // Check ustensil match
    const ustensilFilters = Array.from(activeFilters.ustensils);
    for (let j = 0; j < ustensilFilters.length; j++) {
      const ust = ustensilFilters[j];
      let found = false;
      for (let k = 0; k < recipe.ustensils.length; k++) {
        if (recipe.ustensils[k].toLowerCase() === ust.toLowerCase()) {
          found = true;
          break;
        }
      }
      if (!found) {
        ustensilMatch = false;
        break;
      }
    }

    if (searchMatch && ingredientMatch && applianceMatch && ustensilMatch) {
      filteredRecipes.push(recipe);
    }
  }

  return filteredRecipes;
}

export function updateDropdownOptions(filteredRecipes: Recipe[]) {
  const options = {
    ingredients: new Set<string>(),
    appliances: new Set<string>(),
    ustensils: new Set<string>(),
  };

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];
    for (let j = 0; j < recipe.ingredients.length; j++) {
      options.ingredients.add(recipe.ingredients[j].ingredient.toLowerCase());
    }
    options.appliances.add(recipe.appliance.toLowerCase());
    for (let j = 0; j < recipe.ustensils.length; j++) {
      options.ustensils.add(recipe.ustensils[j].toLowerCase());
    }
  }

  updateDropdown("IngredientsWrapper", options.ingredients);
  updateDropdown("AppliancesWrapper", options.appliances);
  updateDropdown("UstensilsWrapper", options.ustensils);
}

export function updateDropdown(wrapperId: string, options: Set<string>) {
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    wrapper.innerHTML = "";
    const sortedOptions = Array.from(options).sort();
    for (let i = 0; i < sortedOptions.length; i++) {
      const item = sortedOptions[i];
      const listDropdownElement = createElementWithClass(
        "option",
        ComponentsClasses.listDropdownElement
      );
      listDropdownElement.textContent = item;
      listDropdownElement.addEventListener("click", () =>
        toggleFilter(wrapperId, item)
      );
      wrapper.appendChild(listDropdownElement);
    }
  }
}

export function filterDropdownOptions(category: string, searchTerm: string) {
  const wrapper = document.getElementById(`${category}Wrapper`);
  if (wrapper) {
    const options = Array.from(wrapper.children) as HTMLElement[];
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      if (
        option.textContent &&
        option.textContent.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        option.style.display = "";
      } else {
        option.style.display = "none";
      }
    }
  }
}
