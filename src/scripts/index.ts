import recipes from "../data/data.json";
import getRecipeTemplate from "../components/RecipeComponent";
import { Recipe } from "../types/Recipe";

const sectionRecipes = document.getElementById("sectionRecipes") as HTMLElement;
const inputSearchBar = document.getElementById(
  "searchRecipe"
) as HTMLInputElement;
const dropdownButtons = document.querySelectorAll(".dropdownButton");
const resetButton = document.getElementById("reset") as HTMLElement;

const CSS_CLASSES = {
  recipeArticle: "bg-white max-w-sm w-full max-h-3xl h-full rounded-3xl",
  recipeIngredientTitle: "uppercase font-bold text-xs text-grey my-2",
  recipeIngredientsGridWrapper: "grid grid-cols-2 gap-6 pb-16",
  recipeIngredientName: "font-Manrope text-sm",
  recipeIngredientQuantity: "font-Manrope text-sm text-grey",
  listDropdownElement:
    "font-Manrope text-sm cursor-pointer max-w-48 px-4 py-2 hover:bg-yellow",
  tag: "inline-flex items-center bg-blue-500 text-white rounded px-2 py-1 mr-2 mb-2",
};

let activeFilters: {
  ingredients: Set<string>;
  appliances: Set<string>;
  ustensils: Set<string>;
} = {
  ingredients: new Set(),
  appliances: new Set(),
  ustensils: new Set(),
};

let currentSearchTerm = "";

function createElementWithClass(tag: string, className: string): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

function filterRecipes(recipes: Recipe[]): Recipe[] {
  return recipes.filter((recipe) => {
    const searchMatch =
      currentSearchTerm.length < 3 ||
      (currentSearchTerm.length >= 3 &&
        (recipe.name.toLowerCase().includes(currentSearchTerm) ||
          recipe.description.toLowerCase().includes(currentSearchTerm) ||
          recipe.ingredients.some((ing) =>
            ing.ingredient.toLowerCase().includes(currentSearchTerm)
          )));

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

function updateRecipesDisplay() {
  const filteredRecipes = filterRecipes(recipes);
  sectionRecipes.innerHTML = "";

  const fragment = document.createDocumentFragment();

  for (const recipe of filteredRecipes) {
    const recipeArticle = createElementWithClass(
      "article",
      CSS_CLASSES.recipeArticle
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
  if (recipesCountElement) {
    recipesCountElement.textContent = `${filteredRecipes.length} recettes`;
  }

  updateDropdownOptions(filteredRecipes);
}

function createRecipeIngredients(recipe: Recipe): HTMLElement {
  const recipeIngredients = document.createElement("div");
  const recipeIngredientsTitle = createElementWithClass(
    "p",
    CSS_CLASSES.recipeIngredientTitle
  );
  const recipeIngredientsGridWrapper = createElementWithClass(
    "div",
    CSS_CLASSES.recipeIngredientsGridWrapper
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
      CSS_CLASSES.recipeIngredientName
    );
    const recipeIngredientQuantity = createElementWithClass(
      "p",
      CSS_CLASSES.recipeIngredientQuantity
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

function updateDropdownOptions(filteredRecipes: Recipe[]) {
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

function updateDropdown(wrapperId: string, options: Set<string>) {
  const wrapper = document.getElementById(wrapperId);
  if (wrapper) {
    wrapper.innerHTML = "";
    Array.from(options)
      .sort()
      .forEach((item) => {
        const listDropdownElement = createElementWithClass(
          "option",
          CSS_CLASSES.listDropdownElement
        );
        listDropdownElement.textContent = item;
        listDropdownElement.addEventListener("click", () =>
          toggleFilter(wrapperId, item)
        );
        wrapper.appendChild(listDropdownElement);
      });
  }
}

function toggleFilter(category: string, value: string) {
  const filterCategory = category
    .replace("Wrapper", "")
    .toLowerCase() as keyof typeof activeFilters;
  if (activeFilters[filterCategory].has(value.toLowerCase())) {
    removeTag(filterCategory, value);
  } else {
    addTag(filterCategory, value);
  }
}

function addTag(category: string, value: string) {
  const filterCategory = category.toLowerCase() as keyof typeof activeFilters;
  activeFilters[filterCategory].add(value.toLowerCase());
  updateRecipesDisplay();
  updateTagsDisplay();
}

function removeTag(category: string, value: string) {
  const filterCategory = category.toLowerCase() as keyof typeof activeFilters;
  activeFilters[filterCategory].delete(value.toLowerCase());
  updateRecipesDisplay();
  updateTagsDisplay();
}

function updateTagsDisplay() {
  const tagsContainer = document.getElementById("tagsContainer");
  tagsContainer.innerHTML = "";

  for (const [category, values] of Object.entries(activeFilters)) {
    for (const value of values) {
      const tagElement = createTag(category, value);
      tagsContainer.appendChild(tagElement);
    }
  }
}

function createTag(category: string, value: string): HTMLElement {
  const tag = createElementWithClass("div", CSS_CLASSES.tag);
  tag.textContent = value;

  const removeButton = document.createElement("button");
  removeButton.textContent = "×";
  removeButton.className = "ml-2 font-bold";
  removeButton.addEventListener("click", () => removeTag(category, value));

  tag.appendChild(removeButton);
  return tag;
}

function initializeEventListeners() {
  inputSearchBar.addEventListener("input", () => {
    currentSearchTerm = inputSearchBar.value.toLowerCase().trim();
    resetButton.classList.toggle("hidden", !currentSearchTerm);
    if (currentSearchTerm.length >= 3 || currentSearchTerm.length === 0) {
      updateRecipesDisplay();
    }
  });

  resetButton.addEventListener("click", () => {
    inputSearchBar.value = "";
    currentSearchTerm = "";
    resetButton.classList.add("hidden");
    activeFilters = {
      ingredients: new Set(),
      appliances: new Set(),
      ustensils: new Set(),
    };
    updateRecipesDisplay();
    updateTagsDisplay();
  });

  dropdownButtons.forEach((dropdownButton) => {
    dropdownButton.addEventListener("click", (e) => {
      const dropdownMenu = dropdownButton.querySelector("div");
      dropdownMenu.classList.toggle("hidden");
      dropdownMenu.classList.toggle("flex");
      dropdownButton.classList.toggle("rounded-md");
    });

    const dropdownMenu = dropdownButton.querySelector("div");
    dropdownMenu.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  });

  document.addEventListener("click", (e) => {
    dropdownButtons.forEach((dropdownButton) => {
      const dropdownMenu = dropdownButton.querySelector("div");
      if (!dropdownButton.contains(e.target as Node)) {
        dropdownMenu.classList.add("hidden");
        dropdownMenu.classList.remove("flex");
        dropdownButton.classList.remove("rounded-md");
      }
    });
  });
}

function initializeAutocomplete() {
  const dropdownInputs = document.querySelectorAll(".dropdownInput");
  dropdownInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const category = target.getAttribute("data-category");
      const value = target.value.toLowerCase();

      const options = document.querySelectorAll(`#${category}Wrapper option`);
      options.forEach((option) => {
        const optionValue = option.textContent.toLowerCase();
        if (optionValue.includes(value)) {
          option.style.display = "block";
        } else {
          option.style.display = "none";
        }
      });
    });
  });
}

function fillDropdownMenus() {
  updateDropdownOptions(recipes);
}

function init() {
  updateRecipesDisplay();
  fillDropdownMenus();
  initializeEventListeners();
  initializeAutocomplete();
}

init();
