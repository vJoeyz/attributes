import type { PaginationButtonElement } from '@finsweet/ts-utils';

// TODO: Remove this after `cmscore v1.5.0` is rolled out.
/**
 * Extracts the pages query from a `Pagination Next` button.
 * @param paginationNext A {@link PaginationButtonElement}.
 * @returns A tuple with [pagesQuery, nextPageNumber].
 */
export const extractPaginationQuery = ({ href }: PaginationButtonElement) => {
  const { searchParams } = new URL(href);

  const [pageEntry] = [...searchParams.entries()];
  if (!pageEntry) return;

  const [pagesQuery, rawNextPageNumber] = pageEntry;

  const nextPageNumber = parseInt(rawNextPageNumber);

  return [pagesQuery, nextPageNumber] as const;
};
