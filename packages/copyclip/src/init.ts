import {
  findTextNode,
  type FinsweetAttributeInit,
  isHTMLElement,
  isNotEmpty,
  waitWebflowReady,
} from '@finsweet/attributes-utils';

import { createClipboardJsInstance } from './factory';
import { getAttribute, getInstance, queryAllElements, queryElement } from './utils/selectors';

/**
 * Inits the copy to clipboard functionality.
 */
export const init: FinsweetAttributeInit = async () => {
  await await waitWebflowReady();

  const copyTriggers = queryAllElements('click');

  const clipboardInstances = copyTriggers
    .map((trigger) => {
      if (!isHTMLElement(trigger)) return;

      // Get attributes
      const textToCopy = getAttribute(trigger, 'text');
      const successMessage = getAttribute(trigger, 'message');
      const successDuration = getAttribute(trigger, 'duration');
      const successClass = getAttribute(trigger, 'active');

      // Get the instance index
      const instance = getInstance(trigger);

      // Get the target to be copied, if existing
      const siblingTarget = trigger.parentElement
        ? queryElement('copy-sibling', { scope: trigger.parentElement })
        : null;

      const target = siblingTarget || queryElement('copy-this', { instance });

      // Store the text node and the original text
      const textNode = findTextNode(trigger);
      const originalText = textNode ? textNode.textContent : undefined;

      // Create options object
      const clipboardInstance = createClipboardJsInstance({
        trigger,
        target,
        textToCopy,
        originalText,
        textNode,
        successDuration,
        successMessage,
        successClass,
      });

      return clipboardInstance;
    })
    .filter(isNotEmpty);

  return {
    result: clipboardInstances,
    destroy() {
      for (const clipboardInstance of clipboardInstances) {
        clipboardInstance.destroy();
      }
    },
  };
};
