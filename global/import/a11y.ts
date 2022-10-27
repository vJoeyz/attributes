import { A11Y_ATTRIBUTE } from '$global/constants/attributes';

/**
 * Imports the {@link A11Y_ATTRIBUTE} to the page.
 * @returns The Attribute controls.
 */
export const importA11Y = () => window.fsAttributes.import(A11Y_ATTRIBUTE, '0');
