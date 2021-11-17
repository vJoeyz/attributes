import { Debug } from '@finsweet/ts-utils';

import type { AnimationImport } from 'packages/animation/src/types';
import type { CMSCoreImport } from '$cms/cmscore/src/types';

const ANIMATIONS_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-animation@1/functions.js';
const CMS_CORE_SOURCE = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmscore@1/cmscore.js';
// const CMS_CORE_SOURCE =
//   'https://onedrive.live.com/download?cid=6BF5AC2A9E9521CC&resid=6BF5AC2A9E9521CC%21268836&authkey=AL8OuJL7uMsa2es';

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
 *
 * Once the import has finished, it also stores the `cmscore` version so other `cms` packages can access it.
 *
 * @returns A `Promise` of the package response.
 */
export const importCMSCore = async (): CMSCoreImport => {
  const { fsAttributes } = window;

  fsAttributes.cms ||= {};
  const { cms } = fsAttributes;

  if (cms.coreImport) return cms.coreImport;

  try {
    const cmsCoreImport: CMSCoreImport = import(CMS_CORE_SOURCE);

    cms.coreImport = cmsCoreImport;

    cmsCoreImport.then((cmsCore) => {
      if (cmsCore) cms.coreVersion ||= cmsCore.version;
    });

    return cmsCoreImport;
  } catch (error) {
    Debug.alert(`${error}`, 'error');
    return;
  }
};
