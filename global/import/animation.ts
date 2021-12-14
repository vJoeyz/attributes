import { Debug } from '@finsweet/ts-utils';
import type { AnimationImport } from 'packages/animation/src/types';

const ANIMATIONS_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-animation@1/functions.js';

/**
 * Dynamically imports the `animation` package.
 * After the first import, it stores the response in {@link window.fsAttributes.animation}.
 * @returns A `Promise` of the package response.
 */
export const importAnimations = async (): AnimationImport => {
  const { fsAttributes } = window;

  if (fsAttributes.animationImport) return fsAttributes.animationImport;

  try {
    const animationsImport = import(ANIMATIONS_SOURCE);

    fsAttributes.animationImport = animationsImport;

    return animationsImport;
  } catch (error) {
    Debug.alert(`${error}`, 'error');
    return;
  }
};
