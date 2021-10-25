import { assessScript, initAttributes } from '$utils/attributes';
import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

if (preventsLoad) window.fsAttributes['populate'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
