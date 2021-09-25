import { preventsLoad } from '$utils/attributes';
import { init } from './init';

const { currentScript } = document;

/**
 * Init
 */
if (preventsLoad(currentScript)) window.fsAttributes['linkBlockEdit'] = { init };
else {
  window.Webflow ||= [];
  window.Webflow.push(() => init(currentScript));
}
