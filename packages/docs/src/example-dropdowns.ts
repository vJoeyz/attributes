import { simulateEvent } from '@finsweet/ts-utils';

/**
 * Inits the example dropdowns functionality.
 */
export const initExampleDropdowns = (): void => {
  const exampleDropdowns = document.querySelectorAll<HTMLDivElement>('[id^="example-"]');

  const [firstExample] = exampleDropdowns;

  const { hash } = new URL(window.location.href);
  const exampleId = hash.replace('#', '');

  const exampleToOpen = exampleId
    ? [...exampleDropdowns].find(({ id }) => id === exampleId) || firstExample
    : firstExample;

  if (!exampleToOpen) return;

  simulateEvent(exampleToOpen, 'click');
};
