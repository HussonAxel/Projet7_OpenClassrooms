function getRecipeTemplate(recipeID: number, recipeTime: number, recipePicture: string): string {
  return `
      <div>
        <img src="${recipePicture}" alt="" class="w-full h-[253px] rounded-md" />
        <span id="recipeTime">"${recipeTime}"</span>
      </div>
      <div class="mx-6">
        <h2 id="recipeName" class="font-Anton text-lg my-7"></h2>
        <div class="font-Manrope mb-7">
          <p class="uppercase font-bold text-xs text-grey my-2">Recette</p>
          <p id="recipeSteps"></p>
        </div>
        <div>
          <p class="uppercase font-bold text-xs text-grey my-2">Ingrédients</p>
          <div class="pb-16">
          </div>
        </div>
      </div>
  `;
}

export default getRecipeTemplate;
