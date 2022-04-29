/**
 * Prevents the TOC links from adding the hash in the URL.
 * @param tocWrapper
 */
export const preventURLHash = (tocWrapper: HTMLElement) => {
  tocWrapper.addEventListener('click', ({ target }) => {
    if (!(target instanceof Element)) return;

    const link = target.closest('a');
    if (!link) return;

    window.setTimeout(() => {
      const { origin, pathname, search } = window.location;

      history.replaceState('', document.title, origin + pathname + search);
    });
  });
};
