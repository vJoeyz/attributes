import { queryElement } from '../utils/constants';

/**
 * @returns All the accordion elements on the page.
 */
export const queryAllAccordions = () => queryElement<HTMLElement>('accordion', { operator: 'prefixed', all: true });
