import { isNumber } from '@finsweet/attributes-utils';

import { getAllRadios, getClosestRadioField, getSelectedGroupValue, queryStar } from '../utils/helpers';
import { getAttribute } from '../utils/selectors';

/**
 * Adds/removes the active classes of a group's stars.
 * @param name
 * @param group
 * @param hoveredValue
 */
export const setClasses = (name: string, group: Element, hoveredValue?: number) => {
  const groupActiveClass = getAttribute(group, 'active');

  const selectedValue = getSelectedGroupValue(name);

  const allRadios = getAllRadios(document, name);

  for (const radio of allRadios) {
    const radioField = getClosestRadioField(radio);
    if (!radioField) continue;

    const star = queryStar(radioField);
    if (!star) continue;

    const starActiveClass = getAttribute(star, 'active');
    const activeClass = starActiveClass || groupActiveClass;

    const value = parseInt(radio.value);

    const isHovered = isNumber(hoveredValue) && value <= hoveredValue;
    const isSelected = isNumber(selectedValue) && value <= selectedValue;
    const isActive = isHovered || isSelected;

    if (isActive) {
      star.classList.add(activeClass);
    } else {
      star.classList.remove(activeClass);
    }
  }
};
