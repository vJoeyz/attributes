import { queryElement } from '../utils/selectors';

/**
 * @returns The stakeholder elements, if existing.
 */
export const collectElements = ():
  | {
      previousPlaceholder: HTMLElement | null;
      nextPlaceholder: HTMLElement | null;
      previousEmptyElement: HTMLElement | null;
      nextEmptyElement: HTMLElement | null;
    }
  | undefined => {
  const previousPlaceholder = queryElement('previous');

  const nextPlaceholder = queryElement('next');

  if (!previousPlaceholder && !nextPlaceholder) return;

  const previousEmptyElement = queryElement('previous-empty');
  previousEmptyElement?.remove();

  const nextEmptyElement = queryElement('next-empty');

  nextEmptyElement?.remove();

  return { previousPlaceholder, nextPlaceholder, previousEmptyElement, nextEmptyElement };
};
