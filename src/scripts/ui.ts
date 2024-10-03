import { Recipe } from "./types";
import { filterRecipes, activeFilters } from "./filters";
import { sectionRecipes } from "./domElements";
import ComponentsClasses from "../components/ComponentsClasses";
import getRecipeTemplate from "../components/RecipeComponent";
import recipes from "../data/data.json";
import { toggleFilter, removeTag } from './filters';


export function updateRecipesDisplay() {
  console.log("test");
  const filteredRecipes = filterRecipes(recipes);
  sectionRecipes.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (const recipe of filteredRecipes) {
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

export function createRecipeIngredients(recipe: Recipe): HTMLElement {
  const recipeIngredients = document.createElement("div");
  const recipeIngredientsTitle = createElementWithClass(
    "p",
    ComponentsClasses.recipeIngredientTitle
  );
  const recipeIngredientsGridWrapper = createElementWithClass(
    "div",
    ComponentsClasses.recipeIngredientsGridWrapper
  );

  recipeIngredients.classList.add("recipeIngredient");
  recipeIngredientsTitle.textContent = "Ingrédients";
  recipeIngredients.append(
    recipeIngredientsTitle,
    recipeIngredientsGridWrapper
  );

  for (const { ingredient, quantity, unit } of recipe.ingredients) {
    const recipeIngredientGridItem = document.createElement("div");
    const recipeIngredientName = createElementWithClass(
      "p",
      ComponentsClasses.recipeIngredientName
    );
    const recipeIngredientQuantity = createElementWithClass(
      "p",
      ComponentsClasses.recipeIngredientQuantity
    );

    recipeIngredientName.textContent = ingredient;
    recipeIngredientQuantity.textContent = quantity
      ? unit
        ? `${quantity} ${unit}`
        : `${quantity}`
      : unit || "-";

    recipeIngredientGridItem.append(
      recipeIngredientName,
      recipeIngredientQuantity
    );
    recipeIngredientsGridWrapper.append(recipeIngredientGridItem);
  }

  return recipeIngredients;
}

export function updateDropdownOptions(filteredRecipes: Recipe[]) {
  const options = {
    ingredients: new Set<string>(),
    appliances: new Set<string>(),
    ustensils: new Set<string>(),
  };

  filteredRecipes.forEach((recipe) => {
    recipe.ingredients.forEach((ing) =>
      options.ingredients.add(ing.ingredient.toLowerCase())
    );
    options.appliances.add(recipe.appliance.toLowerCase());
    recipe.ustensils.forEach((ust) => options.ustensils.add(ust.toLowerCase()));
  });

  updateDropdown("IngredientsWrapper", options.ingredients);
  updateDropdown("AppliancesWrapper", options.appliances);
  updateDropdown("UstensilsWrapper", options.ustensils);
}

export function updateDropdown(wrapperId: string, options: Set<string>) {
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    wrapper.innerHTML = "";
    Array.from(options)
      .sort()
      .forEach((item) => {
        const listDropdownElement = createElementWithClass(
          "option",
          ComponentsClasses.listDropdownElement
        );
        listDropdownElement.textContent = item;
        listDropdownElement.addEventListener("click", () =>
          toggleFilter(wrapperId, item)
        );
        wrapper.appendChild(listDropdownElement);
      });
  }
}

export function updateTagsDisplay() {
  const tagsContainer = document.getElementById("tagsContainer");
  if (tagsContainer) {
    tagsContainer.innerHTML = "";

    for (const [category, values] of Object.entries(activeFilters)) {
      for (const value of values) {
        const tagElement = createTag(category, value);
        tagsContainer.appendChild(tagElement);
      }
    }
  }
}

export function createTag(category: string, value: string): HTMLElement {
  const tag = createElementWithClass("div", ComponentsClasses.tag);
  tag.textContent = value;

  const removeButton = document.createElement("button");
  removeButton.textContent = "×";
  removeButton.className = "ml-2 font-bold";
  removeButton.addEventListener("click", () => removeTag(category, value));
  tag.appendChild(removeButton);

  if (category === "search") {
    tag.classList.add("search-tag");
  }

  return tag;
}

export function toggleCloseButton(input: HTMLInputElement, show: boolean) {
  const closeButton = input.parentElement?.querySelector("svg");
  if (closeButton) {
    if (show) {
      closeButton.classList.remove("hidden");
    } else {
      closeButton.classList.add("hidden");
    }
  }
}

export function fillDropdownMenus() {
  updateDropdownOptions(recipes);
}

function createElementWithClass(tag: string, className: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}
