import { assessScript } from '$utils/attributes';
import { importCMSCore } from '$utils/import';
import { init } from './init';

/**
 * Init
 */
const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();

if (preventsLoad) window.fsAttributes['cmsnest'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
