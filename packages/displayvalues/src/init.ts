import { getFormFieldValue, isFormField } from '@finsweet/ts-utils';
import { getInstanceIndex } from 'global/attributes';
import { ATTRIBUTES, getSelector } from './constants';

import type { FormField } from '@finsweet/ts-utils';

const {
  element: { key: elementKey },
  placeholder: { key: placeholderKey },
} = ATTRIBUTES;

const relationshipsMap: Map<FormField, NodeListOf<HTMLElement>> = new Map();

/**
 * Inits click events mirroring.
 */
export const init = (): void => {
  const sourceElements = document.querySelectorAll(getSelector('element', 'source', { operator: 'prefixed' }));

  for (const sourceElement of sourceElements) {
    if (!isFormField(sourceElement)) continue;

    collectTargets(sourceElement);
    syncValue(sourceElement);
  }

  listenEvents();
};

const collectTargets = (sourceElement: FormField) => {
  const instanceIndex = getInstanceIndex(sourceElement, elementKey);

  const displayTargets = document.querySelectorAll<HTMLElement>(getSelector('element', 'target', { instanceIndex }));
  if (!displayTargets.length) return;

  relationshipsMap.set(sourceElement, displayTargets);
};

/**
 * Updates the value of the target element from a source.
 * @param sourceElement
 */
const syncValue = (sourceElement: FormField) => {
  const displayTargets = relationshipsMap.get(sourceElement);
  if (!displayTargets) return;

  for (const displayTarget of displayTargets) {
    const sourceValue = getFormFieldValue(sourceElement);

    const placeholderValue = displayTarget.getAttribute(placeholderKey);

    const displayValue = sourceValue ? sourceValue : placeholderValue;

    displayTarget.textContent = displayValue;
  }
};

/**
 * Listens for input events.
 */
const listenEvents = () => {
  window.addEventListener('input', ({ target }) => {
    if (!(target instanceof Element)) return;

    const sourceElement = target.closest(getSelector('element', 'source', { operator: 'prefixed' }));

    if (isFormField(sourceElement)) syncValue(sourceElement);
  });
};
