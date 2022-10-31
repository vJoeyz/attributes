import {
  ARIA_CONTROLS_KEY,
  ARIA_HASPOPUP_KEY,
  ARIA_MODAL_KEY,
  ARIA_MODAL_VALUES,
  ARIA_ROLEDESCRIPTION_KEY,
  ARIA_ROLE_KEY,
  ARIA_ROLE_VALUES,
} from '$global/constants/a11y';
import { ensureUniqueId } from '$global/helpers';

/**
 * Sets A11Y Attributes to a modal.
 * @param modalElement
 * @param openTriggers
 * @param closeTriggers
 */
export const setModalA11Y = (modalElement: HTMLElement, openTriggers: Element[], closeTriggers: Element[]) => {
  const modalId = ensureUniqueId(modalElement);
  modalElement.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.dialog);
  modalElement.setAttribute(ARIA_MODAL_KEY, ARIA_MODAL_VALUES.true);

  for (const trigger of [...openTriggers, ...closeTriggers]) {
    trigger.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
    trigger.setAttribute(ARIA_ROLEDESCRIPTION_KEY, 'open');
    trigger.setAttribute(ARIA_CONTROLS_KEY, modalId);
    trigger.setAttribute(ARIA_HASPOPUP_KEY, ARIA_ROLE_VALUES.dialog);
    ensureUniqueId(trigger);
  }

  for (const trigger of openTriggers) {
    trigger.setAttribute(ARIA_ROLEDESCRIPTION_KEY, 'open');
  }

  for (const trigger of closeTriggers) {
    trigger.setAttribute(ARIA_ROLEDESCRIPTION_KEY, 'close');
  }
};
