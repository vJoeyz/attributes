import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { assessScript, initAttributes } from '$global/factory';
import { ATTRIBUTES, CLIENT_ID } from '$packages/launchdarkly/src/utils/constants';

import { version } from '../package.json';
import { init } from './init';

// generate css tag that contains sample selectors and append it to the head of the document
// This has to run before initialization of the attributes
const defaultStyle = `
        [fs-launchdarkly-showif] {
            display: none;
        }
    `;
const style = document.createElement('style');
style.innerHTML = defaultStyle;
document.head.appendChild(style);

/**
 * Init
 */
initAttributes();
window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE] ||= {};

const { preventsLoad, attributes } = assessScript({ [CLIENT_ID]: ATTRIBUTES.clientId.key });
const attribute = window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE];

attribute.version = version;

if (preventsLoad)
  attribute.init = (clientId?: string) => {
    return init({
      ...attributes,
      clientId: clientId,
    });
  };
else {
  window.Webflow ||= [];
  window.Webflow.push(() => init(attributes));
  init(attributes);
}
