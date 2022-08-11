import { assessScript, initAttributes } from '@global/factory';
import { CMS_GREENHOUSE_ATTRIBUTE } from 'global/constants/attributes';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */

initAttributes();

window.fsAttributes[CMS_GREENHOUSE_ATTRIBUTE] ||= {};

const { preventsLoad } = assessScript();
const attribute = window.fsAttributes[CMS_GREENHOUSE_ATTRIBUTE];

attribute.version = version;

if (preventsLoad) attribute.init = init;
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}

(window as any).currentScript = document.currentScript;
