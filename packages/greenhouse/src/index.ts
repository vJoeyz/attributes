import { assessScript, initAttributes } from '@global/factory';
import { GREENHOUSE_ATTRIBUTE } from 'global/constants/attributes';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */

initAttributes();

window.fsAttributes[GREENHOUSE_ATTRIBUTE] ||= {};

const { preventsLoad } = assessScript();
const attribute = window.fsAttributes[GREENHOUSE_ATTRIBUTE];

attribute.version = version;

if (preventsLoad) attribute.init = init;
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}

(window as any).currentScript = document.currentScript;
