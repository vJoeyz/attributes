import { assessScript } from '$utils/attributes';
import { init } from './init';

/**
 * Init
 */
const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

if (preventsLoad) window.fsAttributes['animation'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
