import { assessScript, initAttributes } from 'global/attributes';
import { importCMSCore } from 'global/import';
import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();

if (preventsLoad) window.fsAttributes['cmscombine'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
