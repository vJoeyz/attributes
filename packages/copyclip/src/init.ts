import { findTextNode } from '@finsweet/ts-utils';
import { ATTRIBUTES, DEFAULT_SUCCESS_DURATION, DEFAULT_SUCCESS_CSS_CLASS, getSelector } from './constants';
import { getInstanceIndex } from '$utils/attributes';
import { createClipboardJsInstance } from './factory';

import type ClipboardJS from 'clipboard';

// Constants destructuring
const {
  element: { key: elementKey },
  text: { key: textKey },
  globalSelector: { key: globalSelectorKey },
  successMessage: { key: successMessageKey },
  successDuration: { key: successDurationKey },
  successClass: { key: successClassKey },
} = ATTRIBUTES;

// Types
interface Params {
  selector?: string;
  targetSelector?: string;
  text?: string;
  successMessage?: string;
  successDuration?: string;
  successClass?: string;
}

/**
 * Inits the copy to clipboard functionality.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.selector A valid CSS selector to query all the triggers.
 * @param params.targetSelector A valid CSS selector to query the target element to copy.
 * @param params.text The text to copy.
 * @param params.successMessage The message that will be displayed on success.
 * @param params.successDuration The duration of the success state.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): ClipboardJS['destroy'][] => {
  let globalSelector: string | null | undefined = null;
  let globalTargetSelector: string | null | undefined = null;
  let globalText: string | null | undefined = null;
  let globalSuccessMessage: string | null | undefined = null;
  let globalSuccessDuration: string | null | undefined = null;
  let globalSuccessClass: string | null | undefined = null;

  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    globalSelector = params.getAttribute(globalSelectorKey);
    globalSuccessMessage = params.getAttribute(successMessageKey);
    globalSuccessDuration = params.getAttribute(successDurationKey);
    globalSuccessClass = params.getAttribute(successClassKey);
  } else if (params) {
    globalSelector = params.selector;
    globalTargetSelector = params.targetSelector;
    globalText = params.text;
    globalSuccessMessage = params.successMessage;
    globalSuccessDuration = params.successDuration;
    globalSuccessClass = params.successClass;
  }

  const copyTriggers = document.querySelectorAll(
    `${getSelector('element', 'trigger', { operator: 'prefixed' })}${globalSelector ? `, ${globalSelector}` : ''}`
  );

  const destroyCallbacks: ClipboardJS['destroy'][] = [];

  for (const trigger of copyTriggers) {
    if (!(trigger instanceof HTMLElement)) continue;

    // Get attributes
    const textToCopy = trigger.getAttribute(textKey) || globalText;
    const successMessage = trigger.getAttribute(successMessageKey) || globalSuccessMessage;
    const successDuration = +(
      trigger.getAttribute(successDurationKey) ||
      globalSuccessDuration ||
      DEFAULT_SUCCESS_DURATION
    );
    const successClass = trigger.getAttribute(successClassKey) || globalSuccessClass || DEFAULT_SUCCESS_CSS_CLASS;

    // Get the instance index
    const instanceIndex = getInstanceIndex(trigger, elementKey);

    // Get the target to be copied, if existing
    const siblingTarget = trigger.parentElement?.querySelector(
      getSelector('element', 'sibling', { operator: 'prefixed' })
    );

    const target =
      siblingTarget ||
      document.querySelector(globalTargetSelector || getSelector('element', 'target', { instanceIndex }));

    // Store the text node and the original text
    const textNode = findTextNode(trigger);
    const originalText = textNode ? textNode.textContent : undefined;

    // Create options object
    destroyCallbacks.push(
      createClipboardJsInstance({
        trigger,
        target,
        textToCopy,
        originalText,
        textNode,
        successDuration,
        successMessage,
        successClass,
      })
    );
  }

  return destroyCallbacks;
};
