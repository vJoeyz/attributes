import { LAUNCHDARKLY_ATTRIBUTE } from '$global/constants/attributes';
import { assessScript, initAttributes } from '$global/factory';
import { ATTRIBUTES } from '$packages/launchdarkly/src/utils/constants';

import { version } from '../package.json';
import { init } from './init';

initAttributes();
window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE] ||= {};

const { preventsLoad, attributes } = assessScript({
  devClientId: ATTRIBUTES.devClientId.key,
  prodClientId: ATTRIBUTES.prodClientId.key,
});
const attribute = window.fsAttributes[LAUNCHDARKLY_ATTRIBUTE];

attribute.version = version;

if (preventsLoad) attribute.init = init;
else {
  window.Webflow ||= [];
  window.Webflow.push(() => init(attributes));
}
