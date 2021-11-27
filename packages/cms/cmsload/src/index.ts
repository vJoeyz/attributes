import { assessScript, initAttributes } from '$utils/attributes';
import { importAnimations, importCMSCore } from '$utils/import';
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
