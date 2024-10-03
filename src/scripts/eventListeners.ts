import { inputSearchBar, resetButton, dropdownButtons, requiredNumberOfCharacters } from './domElements';
import {
  currentSearchTerm,
  setCurrentSearchTerm,
  addTag,
  activeFilters,
  filterDropdownOptions,
  clearAllInputs,
} from "./filters";
import { updateRecipesDisplay, updateTagsDisplay, toggleCloseButton } from './ui';

export function initializeEventListeners() {
  inputSearchBar.addEventListener("input", () => {
    const searchButton = document.getElementById("search");
    setCurrentSearchTerm(inputSearchBar.value.toLowerCase().trim());
    resetButton.classList.toggle("hidden", !inputSearchBar.value.trim());
    if (searchButton) {
      searchButton.addEventListener("click", (event) => {
        if (currentSearchTerm.length >= requiredNumberOfCharacters) {
          addTag("search", currentSearchTerm);
          inputSearchBar.value = "";
          setCurrentSearchTerm("");
        }
      });
    }
  });

  inputSearchBar.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      if (currentSearchTerm.length >= requiredNumberOfCharacters) {
        addTag("search", currentSearchTerm);
        inputSearchBar.value = "";
        setCurrentSearchTerm("");
      }
    }
  });

  resetButton.addEventListener("click", clearAllInputs);

  dropdownButtons.forEach((dropdownButton) => {
    dropdownButton.addEventListener("click", (e) => {
      const dropdownMenu = dropdownButton.querySelector("div");
      if (dropdownMenu) {
        const isOpening = dropdownMenu.classList.contains("hidden");
        dropdownMenu.classList.toggle("hidden");
        dropdownMenu.classList.toggle("flex");
        dropdownButton.classList.toggle("rounded-md");

        if (!isOpening) {
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
    });
  });

  const filterInputs = document.querySelectorAll(".dropdownInput");
  filterInputs.forEach((input) => {
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      const category = target.getAttribute("data-category");
      const searchTerm = target.value.trim();

      toggleCloseButton(target, searchTerm.length > 0);

      if (category) {
        if (searchTerm.length >= requiredNumberOfCharacters) {
          filterDropdownOptions(category, searchTerm);
        } else {
          filterDropdownOptions(category, "");
        }
      }
    });

    const closeButton = input.parentElement?.querySelector("svg");
    if (closeButton) {
      closeButton.addEventListener("click", () => {
        (input as HTMLInputElement).value = "";
        toggleCloseButton(input as HTMLInputElement, false);
        const category = input.getAttribute("data-category");
        if (category) {
          filterDropdownOptions(category, "");
        }
      });
    }
  });
}