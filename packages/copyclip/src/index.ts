import { preventLoad } from '$utils/globals';
import { init } from './init';

const { currentScript } = document;

/**
 * Init
 */
if (preventLoad(currentScript)) window.fsAttributes['copyClip'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(() => init({ currentScript }));
}
