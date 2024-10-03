import { toggleCloseButton } from "./utils";
import { filterDropdownOptions } from "./filters";
import { updateRecipesDisplay } from "./search";
import { ActiveFilters } from "./types";
import { Recipe } from "./types";

export function initializeEventListeners(
  recipes: Recipe[],
  activeFilters: ActiveFilters
) {
  const inputSearchBar = document.getElementById(
    "searchRecipe"
  ) as HTMLInputElement;
  const dropdownButtons = document.querySelectorAll(".dropdownButton");
  const resetButton = document.getElementById("reset") as HTMLDivElement;
  const requiredNumberOfCharacters = 3;

  inputSearchBar.addEventListener("input", (e) => {
    const target = e.target as HTMLInputElement;
    const searchTerm = target.value.trim().toLowerCase();

    if (searchTerm.length >= requiredNumberOfCharacters) {
      activeFilters.search = new Set(searchTerm.split(" "));
    } else {
      activeFilters.search.clear();
    }

    updateRecipesDisplay(recipes, activeFilters);
  });

  for (let i = 0; i < dropdownButtons.length; i++) {
    const dropdownButton = dropdownButtons[i];
    dropdownButton.addEventListener("click", () => {
      const dropdownMenu = dropdownButton.querySelector("div");
      if (dropdownMenu) {
        dropdownMenu.classList.toggle("hidden");
        dropdownMenu.classList.toggle("flex");
        dropdownButton.classList.toggle("rounded-md");
      }
    });
  }

  resetButton.addEventListener("click", () => {
    activeFilters.ingredients.clear();
    activeFilters.appliances.clear();
    activeFilters.ustensils.clear();
    activeFilters.search.clear();

    inputSearchBar.value = "";
    updateRecipesDisplay(recipes, activeFilters);

    const tagContainer = document.getElementById("tagContainer");
    if (tagContainer) {
      tagContainer.innerHTML = "";
    }
  });

  document.addEventListener("click", (e) => {
    for (let i = 0; i < dropdownButtons.length; i++) {
      const dropdownButton = dropdownButtons[i];
      const dropdownMenu = dropdownButton.querySelector("div");
      if (dropdownMenu && !dropdownButton.contains(e.target as Node)) {
        dropdownMenu.classList.add("hidden");
        dropdownMenu.classList.remove("flex");
        dropdownButton.classList.remove("rounded-md");

        const input = dropdownButton.querySelector(
          ".dropdownInput"
        ) as HTMLInputElement;
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

  const filterInputs = document.querySelectorAll(".dropdownInput");
  for (let i = 0; i < filterInputs.length; i++) {
    const input = filterInputs[i] as HTMLInputElement;
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
    const closeButton = input.parentElement?.querySelector("svg");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        input.value = "";
        toggleCloseButton(input, false);
        const category = input.getAttribute("data-category");
        if (category) {
          filterDropdownOptions(category, "");
        }
      });
    }
  }
}
