function getRecipeTemplate(
  recipeID: number,
  recipeTime: number,
  recipePicture: string,
  recipeDescription: string,
  recipeName: string,
): string {
  return `
          <div class="relative max-w-xl mx-auto">
            <img class="h-64 w-full object-cover rounded-t-3xl" src="${recipePicture}"
              alt="Random image">
            <div class="absolute inset-0 bg-gray-700 opacity-60"></div>
            <div class="absolute top-0 right-0 bg-yellow w-16 h-6 rounded-full m-4 flex items-center justify-center">
              <p class="font-Manrope text-xs">${recipeTime}min</p>
            </div>
          </div>
          <div id="recipeWrapper" class="mx-6">
            <h2 id="recipeName" class="font-Anton text-lg my-7">${recipeName}</h2>
            <div class="font-Manrope mb-7">
              <p class="uppercase font-bold text-xs text-grey my-2 tracking-wide">Recette</p>
              <p id="recipeSteps" class="line-clamp-4 text-sm font-Manrope">${recipeDescription}</p>
            </div>
          </div>
  `;
}

export default getRecipeTemplate;
