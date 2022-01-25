import { assessScript } from '$global/factory/assess';
import { initAttributes } from '$global/factory/init';

import { ATTRIBUTE } from './constants';
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
