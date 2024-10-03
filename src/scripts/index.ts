import { initializeEventListeners } from './eventListeners';
import { updateRecipesDisplay, fillDropdownMenus } from './ui';
import { clearAllInputs } from './filters';

function init() {
    clearAllInputs();
    updateRecipesDisplay();
    fillDropdownMenus();
    initializeEventListeners();
}

init();