import { assessScript, initAttributes } from 'global/attributes';
import { ATTRIBUTE } from './utils/constants';
import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

if (preventsLoad) window.fsAttributes[ATTRIBUTE] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
