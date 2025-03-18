import { type PaginationButtonElement } from '@finsweet/attributes-utils';

import type { List } from '../components/List';

const { location, history } = window;

/**
 * Extracts the {@link URLSearchParams} from a list's Pagination Button.
 * @param paginationButton A {@link PaginationButtonElement}.
 *
 * @returns The search params as {@link Object.entries}, if the button is valid.
 */
export const getPaginationSearchEntries = (paginationButton: PaginationButtonElement) => {
  const { href } = paginationButton;

  const { searchParams } = new URL(href);

  const searchEntries = [...searchParams.entries()];
  return searchEntries;
};
