import { assessScript, initAttributes } from 'global/attributes';
import { importAnimations, importCMSCore } from 'global/import';
import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();
importAnimations();

if (preventsLoad) window.fsAttributes['cmssort'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
