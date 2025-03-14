import { FORM_CSS_CLASSES, getRadioGroupInputs } from '@finsweet/attributes-utils';

import { getAttribute } from '../utils/selectors';

/**
 * Handles adding/removing the active class from an input.
 * @param input
 */
export const handleInputActiveClass = (input: HTMLInputElement) => {
  // Checkboxes
  const isCheckbox = input.type === 'checkbox';
  const checkboxField = input.closest(`.${FORM_CSS_CLASSES.checkboxField}`);

  if (isCheckbox && checkboxField) {
    const activeClass = getAttribute(input, 'activeclass');

    setClass(checkboxField, activeClass, input.checked);
    return;
  }

  // Radios
  const isRadio = input.type === 'radio';
  if (!isRadio) return;

  const groupRadios = getRadioGroupInputs(input);
  for (const radio of groupRadios) {
    const radioField = radio.closest(`.${FORM_CSS_CLASSES.radioField}`);
    if (!radioField) continue;

    const activeClass = getAttribute(radio, 'activeclass');

    setClass(radioField, activeClass, radio.checked);
  }
};

/**
 * Adds/removes the active class from an element.
 * @param target
 * @param className
 * @param add
 */
const setClass = (target: Element, className: string, add = true) =>
  target.classList[add ? 'add' : 'remove'](className);
