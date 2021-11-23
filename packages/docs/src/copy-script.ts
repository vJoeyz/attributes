import { getSelector } from './constants';
import { init } from '@finsweet/attributes-copyclip/src/init';
import { ATTRIBUTES as COPYCLIP_ATTRIBUTES } from '@finsweet/attributes-copyclip/src/constants';

/**
 * Inits the `Copy Example` functionality.
 * @param copyCode The string to copy on click.
 */
export const initCopyScriptButton = (copyCode: string): void => {
  const element = document.querySelector<HTMLAnchorElement>(getSelector('element', 'copyScript'));
  if (!element) return;

  element.setAttribute(COPYCLIP_ATTRIBUTES.element.key, 'click');
  element.setAttribute(COPYCLIP_ATTRIBUTES.text.key, copyCode);
  element.setAttribute(COPYCLIP_ATTRIBUTES.successMessage.key, 'Copied!');

  init();
};
