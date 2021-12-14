import { assessScript } from '$global/factory/assess';
import { initAttributes } from '$global/factory/init';
import { importCMSCore } from '$global/import/cmscore';

import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

importCMSCore();

if (preventsLoad) window.fsAttributes['cmsnest'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
