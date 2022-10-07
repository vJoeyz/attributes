import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { assessScript, initAttributes } from '$global/factory';
import { ATTRIBUTES, CLIENT_ID } from '$packages/launchdarkly/src/utils/constants';

import { version } from '../package.json';
import { init } from './init';

/**
 * Init
 */
initAttributes();
window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE] ||= {};

const { preventsLoad, attributes } = assessScript({ [CLIENT_ID]: ATTRIBUTES.clientId.key });
const attribute = window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE];

attribute.version = version;

if (preventsLoad)
  attribute.init = (clientId?: string) =>
    init({
      ...attributes,
      clientId,
    });
else {
  window.Webflow ||= [];
  window.Webflow.push(() => init(attributes));
  init(attributes);
}
