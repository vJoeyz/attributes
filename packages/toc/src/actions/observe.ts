import type { TOCItem } from '../components/TOCItem';

export const observeHeadings = (tocItems: TOCItem[]) => {
  let targetCache: Element | undefined;
  let dataIndexCache: number | undefined;

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.length) return;

      const { target } = entries[entries.length - 1];
      if (target === targetCache) return;

      targetCache = target;

      const dataIndex = tocItems.findIndex(({ headingElement }) => headingElement && headingElement === target);
      if (dataIndex === -1) return;

      let currentLevel: number | undefined;

      const halfWindowHeight = window.innerHeight / 2;

      for (let i = dataIndexCache && dataIndexCache > dataIndex ? dataIndexCache : dataIndex; i >= 0; i--) {
        const tocItem = tocItems[i];
        const { headingElement, level } = tocItem;
        if (!headingElement) continue;

        if (i > dataIndex || (currentLevel && currentLevel <= level)) {
          tocItem.setState(false);
          continue;
        }

        const { top, height } = headingElement.getBoundingClientRect();

        if (top - height / 2 > halfWindowHeight) {
          tocItem.setState(false);
          continue;
        }

        if (!currentLevel || level < currentLevel) {
          tocItem.setState(true);
          currentLevel = level;
          continue;
        }
      }

      dataIndexCache = dataIndex;
    },
    {
      rootMargin: '-50% 0% -50% 0%',
    }
  );

  for (const { headingElement } of tocItems) {
    if (!headingElement) continue;

    observer.observe(headingElement);
  }
};

export const observeContents = (contentsElement: HTMLElement, tocItems: TOCItem[]) => {
  const observer = new IntersectionObserver(
    (entries) => {
      const { top, height } = contentsElement.getBoundingClientRect();

      const isPast = window.innerHeight / 2 - height > top;
      if (!isPast) return;

      for (const tocItem of tocItems) tocItem.setState(false);
    },
    {
      rootMargin: '-50% 0% -50% 0%',
    }
  );

  observer.observe(contentsElement);
};
