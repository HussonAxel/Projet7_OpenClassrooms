// IMPORTS DECLARATIONS
import recipes from "../data/data.json";
import getRecipeTemplate from "../components/RecipeComponent";

// VARIABLES DECLARATIONS
const sectionRecipes = document.getElementById("sectionRecipes") as HTMLElement;
const inputSearchBar = document.getElementById("searchRecipe") as HTMLInputElement;
const dropdownButtons = document.querySelectorAll('.dropdownButton');
const resetButton = document.getElementById("reset") as HTMLElement;

const CSS_CLASSES = {
    recipeArticle: "bg-white max-w-sm w-full max-h-3xl h-full rounded-3xl",
    recipeIngredientTitle: "uppercase font-bold text-xs text-grey my-2",
    recipeIngredientsGridWrapper: "grid grid-cols-2 gap-6 pb-16",
    recipeIngredientName: "font-Manrope text-sm",
    recipeIngredientQuantity: "font-Manrope text-sm text-grey",
    listDropdownElement: "font-Manrope text-sm cursor-pointer mb-6",
};

function createElementWithClass(tag: string, className: string): HTMLElement {
    const element = document.createElement(tag);
    element.className = className;
    return element;
}

function addRecipes() {
    const fragment = document.createDocumentFragment();

    for (const recipe of recipes) {
        const recipeArticle = createElementWithClass("article", CSS_CLASSES.recipeArticle);
        const recipePicture = `../assets/recipesPictures/Recette${recipe.id}.webp`;
        const recipeIngredients = document.createElement("div");
        const recipeIngredientsTitle = createElementWithClass("p", CSS_CLASSES.recipeIngredientTitle);
        const recipeIngredientsGridWrapper = createElementWithClass("div", CSS_CLASSES.recipeIngredientsGridWrapper);

        recipeIngredients.classList.add("recipeIngredient");

        recipeArticle.innerHTML = getRecipeTemplate(
            recipe.id,
            recipe.time,
            recipePicture,
            recipe.description,
            recipe.name
        );

        const recipeWrapper = recipeArticle.querySelector("#recipeWrapper") as HTMLElement;

        recipeIngredientsTitle.textContent = "Ingrédients";
        recipeIngredients.append(recipeIngredientsTitle, recipeIngredientsGridWrapper);

        for (const { ingredient, quantity, unit } of recipe.ingredients) {
            const recipeIngredientGridItem = document.createElement("div");
            const recipeIngredientName = createElementWithClass("p", CSS_CLASSES.recipeIngredientName);
            const recipeIngredientQuantity = createElementWithClass("p", CSS_CLASSES.recipeIngredientQuantity);

            recipeIngredientName.textContent = ingredient;
            recipeIngredientQuantity.textContent = quantity
                ? unit
                    ? `${quantity} ${unit}`
                    : `${quantity}`
                : unit || '-';

            recipeIngredientGridItem.append(recipeIngredientName, recipeIngredientQuantity);
            recipeIngredientsGridWrapper.append(recipeIngredientGridItem);
        }

        recipeWrapper.append(recipeIngredients);
        fragment.append(recipeArticle);
    }

    sectionRecipes.append(fragment);
}

function fillDropdownMenus() {
    const wrappers = {
        appliances: document.getElementById("AppliancesWrapper"),
        ustensils: document.getElementById("UstensilsWrapper"),
        ingredients: document.getElementById("IngredientsWrapper")
    };

    if (!Object.values(wrappers).every(Boolean)) {
        console.error("Required DOM elements not found");
        return;
    }

    const sets = {
        appliances: new Set<string>(),
        ustensils: new Set<string>(),
        ingredients: new Set<string>()
    };

    recipes.forEach(recipe => {
        sets.appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ustensil => sets.ustensils.add(ustensil));
        recipe.ingredients.forEach(({ ingredient }) => sets.ingredients.add(ingredient));
    });

    const createAndAppendListItems = (container: HTMLElement, items: Set<string>) => {
        const fragment = document.createDocumentFragment();
        Array.from(items).sort().forEach(item => {
            const listDropdownElement = createElementWithClass("li", CSS_CLASSES.listDropdownElement);
            listDropdownElement.textContent = item;
            fragment.appendChild(listDropdownElement);
        });
        container.appendChild(fragment);
    };

    Object.entries(wrappers).forEach(([key, wrapper]) => {
        createAndAppendListItems(wrapper, sets[key as keyof typeof sets]);
    });
}

function initializeEventListeners() {
    inputSearchBar.addEventListener("input", () => {
        resetButton.classList.toggle("hidden", !inputSearchBar.value);
    });

    resetButton.addEventListener("click", () => {
        inputSearchBar.value = "";
        resetButton.classList.add("hidden");
    });

    dropdownButtons.forEach(dropdownButton => {
        dropdownButton.addEventListener("click", () => {
            const dropdownMenu = dropdownButton.nextElementSibling as HTMLElement;
            dropdownMenu.classList.toggle("hidden");
        });
    });
}

function init() {
    addRecipes();
    fillDropdownMenus();
    initializeEventListeners();
}

init();