import { Recipe } from './types';
import { createElementWithClass } from './utils';
import ComponentsClasses from "../components/ComponentsClasses";
import { removeTag } from "./index";

export function createRecipeIngredients(recipe: Recipe): HTMLElement {
    const recipeIngredients = createElementWithClass(
        "div",
        ComponentsClasses.recipeIngredientName
    );

    for (let i = 0; i < recipe.ingredients.length; i++) {
        const ingredient = recipe.ingredients[i];
        const ingredientElement = createElementWithClass(
            "p",
            ComponentsClasses.recipeIngredientName
        );

        const ingredientName = createElementWithClass(
            "span",
            ComponentsClasses.recipeIngredientName
        );
        ingredientName.textContent = ingredient.ingredient;

        ingredientElement.appendChild(ingredientName);

        if (ingredient.quantity) {
            const quantity = createElementWithClass(
                "span",
                ComponentsClasses.recipeIngredientQuantity
            );
            quantity.textContent = `: ${ingredient.quantity}`;

            if (ingredient.unit) {
                quantity.textContent += ` ${ingredient.unit}`;
            }

            ingredientElement.appendChild(quantity);
        }

        recipeIngredients.appendChild(ingredientElement);
    }

    return recipeIngredients;
}

export function createTag(category: string, value: string): HTMLElement {
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