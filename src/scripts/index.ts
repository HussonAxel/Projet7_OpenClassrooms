import recipes from "../data/data.json";
import getRecipeTemplate from "../components/RecipeComponent";
import ComponentsClasses from "../components/ComponentsClasses"
import {Recipe} from "@/scripts/types/Recipe";

const sectionRecipes = document.getElementById("sectionRecipes") as HTMLElement,
    inputSearchBar = document.getElementById(
        "searchRecipe"
    ) as HTMLInputElement,
    dropdownButtons = document.querySelectorAll(".dropdownButton"),
    resetButton = document.getElementById("reset") as HTMLDivElement,
    requiredNumberOfCharacters = 3

let activeFilters: {
    ingredients: Set<string>;
    appliances: Set<string>;
    ustensils: Set<string>;
    search: Set<string>;
} = {
    ingredients: new Set(),
    appliances: new Set(),
    ustensils: new Set(),
    search: new Set()
};

let currentSearchTerm = "";

function createElementWithClass(tag: string, className: string): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function filterRecipes(recipes: Recipe[]): Recipe[] {
    return recipes.filter((recipe) => {
        const searchMatch = Array.from(activeFilters.search).every(term =>
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

function updateRecipesDisplay() {
    console.log("test")
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
    const noResults = document.getElementById("noResults")
    if (recipesCountElement) {
        if (filteredRecipes.length) {
            recipesCountElement.textContent = `${filteredRecipes.length} recettes`;
            noResults.classList.add("hidden")
        } else {
            recipesCountElement.textContent = `${filteredRecipes.length} recette`;
            noResults.textContent = `Aucune recette ne contient '${Array.from(activeFilters.search).join(", ")}', vous pouvez chercher «
tarte aux pommes », « poisson », etc`;
            noResults.classList.remove("hidden")
            noResults.classList.add("font-Manrope", "text-black", "text-center");
        }
    }

    updateDropdownOptions(filteredRecipes);
}

function createRecipeIngredients(recipe: Recipe): HTMLElement {
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

    for (const {ingredient, quantity, unit} of recipe.ingredients) {
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

function createTag(category: string, value: string): HTMLElement {
    const tag = createElementWithClass("div", ComponentsClasses.tag);
    tag.textContent = value;

    const removeButton = document.createElement("button");
    removeButton.textContent = "×";
    removeButton.className = "ml-2 font-bold";
    removeButton.addEventListener("click", () => removeTag(category, value));
    tag.appendChild(removeButton);

    // Add a specific class for search tags
    if (category === "search") {
        tag.classList.add("search-tag");
    }

    return tag;
}

function filterDropdownOptions(category: string, searchTerm: string) {
    const wrapper = document.getElementById(`${category}Wrapper`);
    if (wrapper) {
        const options = Array.from(wrapper.children) as HTMLElement[];
        options.forEach((option) => {
            if (option.textContent && option.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
                option.style.display = "";
            } else {
                option.style.display = "none";
            }
        });
    }
}

function toggleCloseButton(input: HTMLInputElement, show: boolean) {
    const closeButton = input.parentElement?.querySelector('svg') as HTMLElement;
    if (closeButton) {
        if (show) {
            closeButton.classList.remove('hidden');
        } else {
            closeButton.classList.add('hidden');
        }
    }
}

function initializeEventListeners() {
    inputSearchBar.addEventListener("input", () => {
        const searchButton = document.getElementById("search");
        currentSearchTerm = inputSearchBar.value.toLowerCase().trim();
        resetButton.classList.toggle("hidden", !currentSearchTerm);
        if (searchButton) {
            searchButton.addEventListener("click", event => {
                if (currentSearchTerm.length >= requiredNumberOfCharacters) {
                    addTag("search", currentSearchTerm);
                    inputSearchBar.value = "";  // Clear the search bar after adding the tag
                    currentSearchTerm = "";
                }
            });
        }
    });

    // Add event listener for 'Enter' key in the search bar
    inputSearchBar.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            if (currentSearchTerm.length >= requiredNumberOfCharacters) {
                addTag("search", currentSearchTerm);
                inputSearchBar.value = "";  // Clear the search bar after adding the tag
                currentSearchTerm = "";
            }
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
            search: new Set()
        };
        updateRecipesDisplay();
        updateTagsDisplay();
    });

    dropdownButtons.forEach((dropdownButton) => {
        dropdownButton.addEventListener("click", (e) => {
            const dropdownMenu = dropdownButton.querySelector("div");
            if (dropdownMenu) {
                const isOpening = dropdownMenu.classList.contains("hidden");
                dropdownMenu.classList.toggle("hidden");
                dropdownMenu.classList.toggle("flex");
                dropdownButton.classList.toggle("rounded-md");

                if (!isOpening) {
                    // Clear input and hide close button when closing the dropdown
                    const input = dropdownButton.querySelector(".dropdownInput") as HTMLInputElement;
                    if (input) {
                        input.value = "";
                        toggleCloseButton(input, false);
                        const category = input.getAttribute("data-category");
                        if (category) {
                            filterDropdownOptions(category, "");
                        }
                    }
                }
            }
        });

        const dropdownMenu = dropdownButton.querySelector("div");
        if (dropdownMenu) {
            dropdownMenu.addEventListener("click", (e) => {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener("click", (e) => {
        dropdownButtons.forEach((dropdownButton) => {
            const dropdownMenu = dropdownButton.querySelector("div");
            if (dropdownMenu && !dropdownButton.contains(e.target as Node)) {
                dropdownMenu.classList.add("hidden");
                dropdownMenu.classList.remove("flex");
                dropdownButton.classList.remove("rounded-md");

                // Clear input and hide close button when closing the dropdown
                const input = dropdownButton.querySelector(".dropdownInput") as HTMLInputElement;
                if (input) {
                    input.value = "";
                    toggleCloseButton(input, false);
                    const category = input.getAttribute("data-category");
                    if (category) {
                        filterDropdownOptions(category, "");
                    }
                }
            }
        });
    });

    // Add event listeners for filter search inputs
    const filterInputs = document.querySelectorAll(".dropdownInput");
    filterInputs.forEach((input) => {
        input.addEventListener("input", (e) => {
            const target = e.target as HTMLInputElement;
            const category = target.getAttribute("data-category");
            const searchTerm = target.value.trim();

            // Toggle close button visibility
            toggleCloseButton(target, searchTerm.length > 0);

            if (category) {
                if (searchTerm.length >= requiredNumberOfCharacters) {
                    filterDropdownOptions(category, searchTerm);
                } else {
                    // Reset the filter if less than required characters
                    filterDropdownOptions(category, "");
                }
            }
        });

        // Add click event listener for the close button
        const closeButton = input.parentElement?.querySelector('svg');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                (input as HTMLInputElement).value = '';
                toggleCloseButton(input as HTMLInputElement, false);
                const category = input.getAttribute("data-category");
                if (category) {
                    filterDropdownOptions(category, "");
                }
            });
        }
    });
}

function fillDropdownMenus() {
    // @ts-ignore
    updateDropdownOptions(recipes);
}

function clearAllInputs() {
    // Clear main search bar
    if (inputSearchBar) {
        inputSearchBar.value = "";
    }

    // Clear filter dropdown inputs and hide close buttons
    const filterInputs = document.querySelectorAll(".dropdownInput") as NodeListOf<HTMLInputElement>;
    filterInputs.forEach((input) => {
        input.value = "";
        toggleCloseButton(input, false);
    });

    // Reset currentSearchTerm
    currentSearchTerm = "";

    // Hide reset button
    resetButton.classList.add("hidden");

    // Clear active filters
    activeFilters = {
        ingredients: new Set(),
        appliances: new Set(),
        ustensils: new Set(),
        search: new Set()
    };

    // Update display
    updateRecipesDisplay();
    updateTagsDisplay();
}

function init() {
    clearAllInputs();  // Clear inputs on initialization
    updateRecipesDisplay();
    fillDropdownMenus();
    initializeEventListeners();
}

init();