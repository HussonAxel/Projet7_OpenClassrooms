export function createElementWithClass(
  tag: string,
  className: string
): HTMLElement {
  const element = document.createElement(tag);
  element.className = className;
  return element;
}

export function toggleCloseButton(input: HTMLInputElement, show: boolean) {
  const closeButton = input.parentElement?.querySelector("svg");
  if (closeButton) {
    if (show) {
      closeButton.classList.remove("hidden");
    } else {
      closeButton.classList.add("hidden");
    }
  }
}
