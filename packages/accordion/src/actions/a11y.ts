import {
  ARIA_CONTROLS_KEY,
  ARIA_EXPANDED_KEY,
  ARIA_LABEL_KEY,
  ARIA_LABELLEDBY_KEY,
  ARIA_ROLE_KEY,
  ARIA_ROLE_VALUES,
  ensureUniqueId,
  TABINDEX_KEY,
} from '@finsweet/attributes-utils';

/**
 * Sets the correspondent aria attributes to the elements.
 * @param trigger
 * @param content
 */
export const setAccordionA11y = (trigger: HTMLElement, content: HTMLElement, isOpen: boolean) => {
  const triggerId = ensureUniqueId(trigger);
  const contentId = ensureUniqueId(content);

  trigger.setAttribute(ARIA_ROLE_KEY, ARIA_ROLE_VALUES.button);
  trigger.setAttribute(ARIA_CONTROLS_KEY, contentId);
  trigger.setAttribute(TABINDEX_KEY, '0');

  setAccordionAriaExpanded(trigger, isOpen);

  if (!content.hasAttribute(ARIA_LABELLEDBY_KEY) && !content.hasAttribute(ARIA_LABEL_KEY)) {
    content.setAttribute(ARIA_LABELLEDBY_KEY, triggerId);
  }
};

/**
 * Sets the [aria-expanded] attribute value to a trigger.
 * @param trigger
 * @param isOpen
 */
export const setAccordionAriaExpanded = (trigger: HTMLElement, isOpen: boolean) => {
  trigger.setAttribute(ARIA_EXPANDED_KEY, String(isOpen));
};
