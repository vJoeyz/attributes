import { initAttributes } from '$global/factory/init';
import { assessScript } from '$global/factory/assess';
import { importAnimations } from '$global/import/animation';
import { importCMSCore } from '$global/import/cmscore';
import { ATTRIBUTE } from './utils/constants';
import { init } from './init';

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
