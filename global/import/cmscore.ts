import { Debug } from '@finsweet/ts-utils';

/**
 * Defined at {@link @global/build/index.js}
 */
declare const CMS_CORE_SOURCE: string;

/**
 * Dynamically imports the `cms/cmscore` package.
 * After the first import, it stores the response in {@link window.fsAttributes.cmscore.import}.
 *
 * Once the import has finished, it also stores the `cmscore` version so other `cms` packages can access it.
 *
 * @returns A `Promise` of the package response.
 */
export const importCMSCore = async () => {
  const { fsAttributes } = window;

  fsAttributes.cmscore ||= {};
  const { cmscore } = fsAttributes;

  if (cmscore.import) return cmscore.import;

  try {
    cmscore.import = import(CMS_CORE_SOURCE);

    cmscore.import.then((cmsCore) => {
      if (cmsCore) cmscore.version ||= cmsCore.version;
    });

    return cmscore.import;
  } catch (error) {
    Debug.alert(`${error}`, 'error');
    return;
  }
};
