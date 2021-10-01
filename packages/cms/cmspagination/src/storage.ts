import type { PageLinks } from './init';

/**
 * @returns The stored page links of a specific Collection List.
 * @param index The index of the Collection List.
 */
export const getStoredPageLinks = (index: number): PageLinks | undefined => {
  const { sessionStorage, location } = window;

  const rawPageLinks = sessionStorage.getItem(`${location.pathname}-${index}`);
  if (rawPageLinks) return JSON.parse(rawPageLinks) as PageLinks;
};

/**
 * Stores the page links of a specific Collection List.
 * @param index The index of the Collection List.
 * @param pageLinks The page links to store.
 */
export const setStoredPageLinks = (index: number, pageLinks: PageLinks): void => {
  const { sessionStorage, location } = window;

  sessionStorage.setItem(`${location.pathname}-${index}`, JSON.stringify(pageLinks));
};
