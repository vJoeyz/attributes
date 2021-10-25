import { assessScript } from '$utils/attributes';
import { importAnimations, importCMSCore } from '$utils/import';
import { init } from './init';

/**
 * Init
 */
const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();
importAnimations();

if (preventsLoad) window.fsAttributes['cmsload'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
