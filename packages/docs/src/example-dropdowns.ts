import { simulateEvent } from '@finsweet/ts-utils';
import { selectedExample } from './stores';

let activeExample: HTMLElement | undefined;
let closingPreviousActiveExample = false;

/**
 * Updates the selected example store.
 * @param dropdown The dropdown that corresponds to the example.
 */
const updateSelectedExample = (dropdown: HTMLElement) => {
  const [, exampleId] = dropdown.id.split('-');
  if (!exampleId) return;

  selectedExample.set(parseInt(exampleId));
};

/**
 * Handles the query params to automatically open a defined example.
 * If no params are defined, the first example opens by default.
 * @param exampleDropdowns
 */
const handleQueryParams = (exampleDropdowns: NodeListOf<HTMLDivElement>) => {
  const [firstExample] = exampleDropdowns;

  const { hash } = new URL(window.location.href);
  const exampleId = hash.replace('#', '');

  const exampleToOpen = exampleId
    ? [...exampleDropdowns].find(({ id }) => id === exampleId) || firstExample
    : firstExample;

  if (!exampleToOpen) return;

  simulateEvent(exampleToOpen, 'click');
  activeExample = exampleToOpen;

  updateSelectedExample(exampleToOpen);
};

/**
 * Handles click events on a dropdown.
 * It makes sure there's always just one dropdown open.
 * @param e
 * @param dropdown
 */
const handleClickEvents = (e: MouseEvent, dropdown: HTMLElement) => {
  if (closingPreviousActiveExample) {
    closingPreviousActiveExample = false;
    return;
  }

  if (dropdown === activeExample) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }

  if (activeExample) {
    closingPreviousActiveExample = true;
    simulateEvent(activeExample, 'click');
  }

  activeExample = dropdown;

  updateSelectedExample(dropdown);
};

/**
 * Inits the example dropdowns functionality.
 */
export const initExampleDropdowns = (): void => {
  const exampleDropdowns = document.querySelectorAll<HTMLDivElement>('[id^="example-"]');

  handleQueryParams(exampleDropdowns);

  for (const dropdown of exampleDropdowns) {
    dropdown.addEventListener('click', (e) => handleClickEvents(e, dropdown), { capture: true });
  }
};
