import { getInstanceIndex } from '$utils/attributes';
import { ATTRIBUTES, getSelector } from './constants';

export const populateSelectElement = (selectElement: HTMLSelectElement) => {
  const instanceIndex = getInstanceIndex(selectElement, ATTRIBUTES.element.key);

  const displaySources = document.querySelectorAll<HTMLElement>(getSelector('element', 'source', { instanceIndex }));
  if (!displaySources) return;
};
