import { ARIA_CONTROLS, ARIA_ROLEDESCRIPTION, ARIA_ROLE_KEY, ARIA_ROLE_VALUES } from '$global/constants/a11ty';
import { ensureUniqueId } from '$global/helpers/elements';

/**
 * Sets A11Y Attributes to a modal.
 * @param modalElement
 * @param openTriggers
 * @param closeTriggers
 */
export const setModalA11Y = (modalElement: HTMLElement, openTriggers: Element[], closeTriggers: Element[]) => {
  const modalId = ensureUniqueId(modalElement);

  for (const trigger of [...openTriggers, ...closeTriggers]) {
    trigger.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
    trigger.setAttribute(ARIA_ROLEDESCRIPTION, 'open');
    trigger.setAttribute(ARIA_CONTROLS, modalId);
  }

  for (const trigger of openTriggers) {
    trigger.setAttribute(ARIA_ROLEDESCRIPTION, 'open');
  }

  for (const trigger of closeTriggers) {
    trigger.setAttribute(ARIA_ROLEDESCRIPTION, 'close');
  }
};
