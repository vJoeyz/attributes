import { animations } from '@finsweet/attributes-utils';

const { fade } = animations;

/**
 * Fade in an element
 * @param element
 * @param display Display property, flex by default
 * @returns An awaitable promise
 */
export const fadeIn = (element: HTMLElement, display = 'flex') => {
  // Prepare the element before displaying it (sets it to opacity 0)
  fade.prepareIn(element, { display });

  fade.animateIn(element, { display });
};

/**
 * Fade out an element
 * @param element
 * @returns An awaitable promise
 */
export const fadeOut = (element: HTMLElement) => {
  fade.animateOut(element, { display: 'none' });
};
