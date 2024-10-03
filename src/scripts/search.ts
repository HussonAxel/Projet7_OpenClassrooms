import { Recipe, ActiveFilters } from "./types";
import { filterRecipes, updateDropdownOptions } from "./filters";
import { createRecipeIngredients } from "./components";
import ComponentsClasses from "../components/ComponentsClasses";
import getRecipeTemplate from "../components/RecipeComponent";
import { createElementWithClass } from "./utils";

export function updateRecipesDisplay(
  recipes: Recipe[],
  activeFilters: ActiveFilters
) {
  const filteredRecipes = filterRecipes(recipes, activeFilters);
  const sectionRecipes = document.getElementById(
    "sectionRecipes"
  ) as HTMLElement;
  sectionRecipes.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < filteredRecipes.length; i++) {
    const recipe = filteredRecipes[i];
    const recipeArticle = createElementWithClass(
      "article",
      ComponentsClasses.recipeArticle
    );
    const recipePicture = `../assets/recipesPictures/Recette${recipe.id}.webp`;

    recipeArticle.innerHTML = getRecipeTemplate(
      recipe.id,
      recipe.time,
      recipePicture,
      recipe.description,
      recipe.name
    );

    const recipeWrapper = recipeArticle.querySelector(
      "#recipeWrapper"
    ) as HTMLElement;
    const recipeIngredients = createRecipeIngredients(recipe);
    recipeWrapper.appendChild(recipeIngredients);

    fragment.appendChild(recipeArticle);
  }

  sectionRecipes.appendChild(fragment);

  const recipesCountElement = document.getElementById("recipesCount");
  const noResults = document.getElementById("noResults");
  if (recipesCountElement) {
    if (filteredRecipes.length) {
      recipesCountElement.textContent = `${filteredRecipes.length} recettes`;
      noResults.classList.add("hidden");
    } else {
      recipesCountElement.textContent = `${filteredRecipes.length} recette`;
      noResults.textContent = `Aucune recette ne contient '${Array.from(
        activeFilters.search
      ).join(", ")}', vous pouvez chercher «
tarte aux pommes », « poisson », etc`;
      noResults.classList.remove("hidden");
      noResults.classList.add("font-Manrope", "text-black", "text-center");
    }
  }
  updateDropdownOptions(filteredRecipes);
}
