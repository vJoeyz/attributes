import { getSelector } from '../utils/constants';

/**
 * Inits the Attribute Select dropdown.
 *
 * @returns A `addOption()` method to populate the options.
 */
export const initAttributeSelect = () => {
  const attributeSelect = document.querySelector(getSelector('element', 'attributeSelect')) as HTMLSelectElement;

  return (title: string) => attributeSelect.options.add(new Option(title, title));
};
