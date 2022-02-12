import { assessScript } from '$global/factory/assess';
import { initAttributes } from '$global/factory/init';
import { importAnimations } from '$global/import/animation';
import { importCMSCore } from '$global/import/cmscore';

import { version } from '../package.json';
import { init } from './init';
import { ATTRIBUTE } from './utils/constants';

/**
 * Init
 */
initAttributes();
importCMSCore();
importAnimations();

window.fsAttributes[ATTRIBUTE] ||= {};

const { preventsLoad } = assessScript();
const attribute = window.fsAttributes[ATTRIBUTE];

attribute.version = version;

if (preventsLoad) attribute.init = init;
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
