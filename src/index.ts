// DATA IMPORTS
import recipes from "./data/data.json";
import getRecipeTemplate from "./components/RecipeComponent";

// VARIABLES DECLARATIONS
const sectionRecipes = document.getElementById(
    "sectionRecipes"
  ) as HTMLSelectElement,
  recipeClasses =
    "bg-white max-w-sm w-full max-h-3xl h-full rounded-md" as string;
function getRecipes(recipesData: object) {
  addRecipes();
}

function addRecipes(): void {
  recipes.forEach((element) => {
    const recipeArticle = document.createElement("article"),
      recipePicture =
        `./assets/recipesPictures/Recette${element.id}.jpg` as string;
    recipeArticle.className = recipeClasses;
    recipeArticle.innerHTML = getRecipeTemplate(
      element.id,
      element.time,
      recipePicture
    );
    sectionRecipes.append(recipeArticle);
  });
}
getRecipes(recipes);
