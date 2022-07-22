export function queryParamFactory(elements: HTMLElement[], value: string) {
  for (const element of elements) {
    // checkbox
    const parentElement = element.parentNode;
    const checkbox = parentElement?.querySelector<HTMLInputElement>(':scope > input[type="checkbox"]');

    if (checkbox) {
      if (element.innerHTML === value) {
        checkbox.checked = true;
      }
      continue;
    }

    // radio
    const radio = parentElement?.querySelector<HTMLInputElement>(':scope > input[type="radio"]');
    if (radio) {
      if (element.innerHTML === value || radio.value === value) {
        radio.checked = true;
      }
      continue;
    }

    // select
    if (element.tagName === 'SELECT') {
      const options = element.querySelectorAll<HTMLElement>('option');
      for (const option of options) {
        if (option.getAttribute('value') === value || option.innerHTML === value) {
          option.setAttribute('selected', 'selected');
        }
      }
      continue;
    }

    // textarea
    if (element.tagName === 'TEXTAREA') {
      const textarea = element as HTMLTextAreaElement;
      textarea.value = value;
      continue;
    }

    // input not a radio, checkbox or a button
    if (element.tagName === 'INPUT' && (element as HTMLInputElement).type !== 'button') {
      const input = element as HTMLInputElement;
      input.value = value;
      continue;
    }

    // all other cases, just replace the innerHTML
    element.innerHTML = value;
  }
}
