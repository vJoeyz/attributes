import { assessScript, initAttributes } from 'global/attributes';
import { init } from './init';

/**
 * Init
 */
initAttributes();

const { currentScript } = document;
const { preventsLoad } = assessScript(currentScript);

if (preventsLoad) window.fsAttributes['autovideo'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(init);
}
