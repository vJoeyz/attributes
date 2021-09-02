import ClipboardJS from 'clipboard';
import { findTextNode, extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES_KEYS, ATTRIBUTES_VALUES, DEFAULT_SUCCESS_DURATION, SUCCESS_CSS_CLASS } from './constants';

interface GlobalParams {
  selector: string;
  successMessage?: string;
  successDuration?: string;
}

/**
 * Inits the copy to clipboard functionality.
 *
 * Auto init:
 * @param params.currentScript The current `<script>` element.
 *
 * Programatic init:
 * @param params.selector A valid CSS selector to query all the triggers.
 * @param params.successMessage The message that will be displayed on success.
 * @param params.successDuration The duration of the success state.
 */
export function init({ globalParams }: { globalParams: GlobalParams }): void;
export function init({ currentScript }: { currentScript: HTMLOrSVGScriptElement | null }): void;
export function init({
  currentScript,
  globalParams,
}: {
  currentScript?: HTMLOrSVGScriptElement | null;
  globalParams?: GlobalParams;
}): void {
  let globalSelector: string | null | undefined = null;
  let globalSuccessMessage: string | null | undefined = null;
  let globalSuccessDuration: string | null | undefined = null;

  if (currentScript) {
    globalSelector = currentScript.getAttribute(ATTRIBUTES_KEYS.globalSelector);
    globalSuccessMessage = currentScript.getAttribute(ATTRIBUTES_KEYS.successMessage);
    globalSuccessDuration = currentScript.getAttribute(ATTRIBUTES_KEYS.successDuration);
  } else if (globalParams) {
    globalSelector = globalParams.selector;
    globalSuccessMessage = globalParams.successMessage;
    globalSuccessDuration = globalParams.successDuration;
  }

  const copyTriggers = document.querySelectorAll(
    `[${ATTRIBUTES_KEYS.element}^="${ATTRIBUTES_VALUES.trigger}"]${globalSelector ? `, ${globalSelector}` : ''}`
  );

  for (const trigger of copyTriggers) {
    if (!(trigger instanceof HTMLElement)) continue;

    // Get attributes
    const elementValue = trigger.getAttribute(ATTRIBUTES_KEYS.element);
    const textToCopy = trigger.getAttribute(ATTRIBUTES_KEYS.text);
    const successMessage = trigger.getAttribute(ATTRIBUTES_KEYS.successMessage) || globalSuccessMessage;
    const successDuration = +(
      trigger.getAttribute(ATTRIBUTES_KEYS.successDuration) ||
      globalSuccessDuration ||
      DEFAULT_SUCCESS_DURATION
    );

    // Get the instance index
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

    // Get the target to be success, if existing
    const target = document.querySelector(`[${ATTRIBUTES_KEYS.element}="${ATTRIBUTES_VALUES.target(instanceIndex)}"]`);

    // Store the text node and the original text
    const textNode = findTextNode(trigger);
    const originalText = textNode ? textNode.textContent : undefined;

    // Create options object
    const options: ClipboardJS.Options = {};

    if (textToCopy) options.text = () => textToCopy;
    else if (target) options.target = () => target;
    else options.text = () => trigger.textContent || '';

    // Create new `ClipboardJS` instance
    const clipboard = new ClipboardJS(trigger, options);

    let successState = false;

    // Clear selection after copy
    clipboard.on('success', (event: ClipboardJS.Event) => {
      event.clearSelection();

      if (successState) return;

      successState = true;

      // Add the success CSS class
      trigger.classList.add(SUCCESS_CSS_CLASS);

      // Add the success message
      if (textNode && successMessage) textNode.textContent = successMessage;

      // Reset after duration
      setTimeout(() => {
        trigger.classList.remove(SUCCESS_CSS_CLASS);
        if (textNode) textNode.textContent = originalText || '';

        successState = false;
      }, successDuration);
    });
  }
}
