export function queryParamFactory(elements: HTMLElement[], value: string) {
  for (const element of elements) {
    // select, textarea and input
    if (
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      (element instanceof HTMLInputElement && element.type !== 'button')
    ) {
      element.value = value;
      continue;
    }

    const parentElement = element.parentNode;

    // checkbox
    const checkbox =
      parentElement?.querySelector<HTMLInputElement>(':scope > input[type="checkbox"]') ||
      element.querySelector<HTMLInputElement>(':scope > input[type="checkbox"]');

    if (checkbox) {
      checkbox.checked = true;
      continue;
    }

    // radio
    const radio =
      parentElement?.querySelector<HTMLInputElement>(':scope > input[type="radio"]') ||
      element.querySelector<HTMLInputElement>(':scope > input[type="radio"]');

    if (radio) {
      if (radio.value === value) {
        radio.checked = true;
      }
      continue;
    }

    // all other cases, just replace the textContent
    element.textContent = value;
  }
}
