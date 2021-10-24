import { getSelector } from './constants';

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
  const previousPlaceholder = document.querySelector<HTMLElement>(
    getSelector('element', 'previous', { operator: 'prefixed' })
  );

  const nextPlaceholder = document.querySelector<HTMLElement>(getSelector('element', 'next', { operator: 'prefixed' }));

  if (!previousPlaceholder && !nextPlaceholder) return;

  const previousEmptyElement = document.querySelector<HTMLElement>(
    getSelector('element', 'previousEmpty', { operator: 'prefixed' })
  );
  previousEmptyElement?.remove();

  const nextEmptyElement = document.querySelector<HTMLElement>(
    getSelector('element', 'nextEmpty', { operator: 'prefixed' })
  );
  nextEmptyElement?.remove();

  return { previousPlaceholder, nextPlaceholder, previousEmptyElement, nextEmptyElement };
};
