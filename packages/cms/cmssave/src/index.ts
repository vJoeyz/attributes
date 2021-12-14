import { assessScript } from '$global/factory/assess';
import { initAttributes } from '$global/factory/init';
import { importAnimations } from '$global/import/animation';
import { importCMSCore } from '$global/import/cmscore';

import { init } from './init';
import { ATTRIBUTE } from './utils/constants';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();
importAnimations();

if (preventsLoad) window.fsAttributes[ATTRIBUTE] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
