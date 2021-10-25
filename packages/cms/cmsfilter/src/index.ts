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

if (preventsLoad) window.fsAttributes['cmsfilter'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
