import { Debug } from '@finsweet/ts-utils';

import type { AnimationImport } from 'packages/animation/src/types';
import type { CMSCoreImport } from 'packages/cms/cmscore/src/types';

const ANIMATIONS_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-animation@1.0.1/functions.js';
const CMS_CORE_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmscore@1.0.3/cmscore.js';

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

/**
 * Dynamically imports the `cms/cmscore` package.
 * After the first import, it stores the response in {@link window.fsAttributes.cms.coreImport}.
 * @returns A `Promise` of the package response.
 */
export const importCMSCore = async (): CMSCoreImport => {
  const { fsAttributes } = window;

  fsAttributes.cms ||= {};

  if (fsAttributes.cms.coreImport) return fsAttributes.cms.coreImport;

  try {
    const cmsCoreImport = import(CMS_CORE_SOURCE);

    fsAttributes.cms.coreImport = cmsCoreImport;

    return cmsCoreImport;
  } catch (error) {
    Debug.alert(`${error}`, 'error');
    return;
  }
};
