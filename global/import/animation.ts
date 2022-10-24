import { Debug } from '@finsweet/ts-utils';

const ANIMATIONS_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-animation@1/functions.js';

/**
 * Dynamically imports the `animation` package.
 * After the first import, it stores the response in {@link window.fsAttributes.animation.import}.
 * @returns A `Promise` of the package response.
 */
export const importAnimations = async () => {
  const { fsAttributes } = window;

  fsAttributes.animation ||= {};
  const { animation } = fsAttributes;

  if (animation.import) {
    return animation.import;
  }

  try {
    animation.import = import(ANIMATIONS_SOURCE);

    return animation.import;
  } catch (error) {
    Debug.alert(`${error}`, 'error');
    return;
  }
};
