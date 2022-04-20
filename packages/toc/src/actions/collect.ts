import { HEADINGS } from '../utils/constants';
import { extractHeadingLevel } from '../utils/helpers';
import type { HeadingData } from '../utils/types';

/**
 * Collects the {@link HeadingData} of all heading elements.
 * @param contentsElement The element that holds all the contents.
 *
 * @returns A {@link HeadingData} array
 */
export const collectHeadingsData = (contentsElement: HTMLElement) => {
  const headingsData: HeadingData[] = [];
  const levelsMemo: HeadingData[] = [];

  const headingElements = contentsElement.querySelectorAll<HTMLHeadingElement>(HEADINGS.join(','));

  for (const headingElement of headingElements) {
    const { tagName } = headingElement;

    const level = extractHeadingLevel(tagName);
    if (!level) continue;

    const headingData: HeadingData = {
      level,
      headingElement,
      children: [],
    };

    let levelMemo: HeadingData | undefined;

    for (let i = levelsMemo.length - 1; i >= 0; i--) {
      levelMemo = levelsMemo[i];

      if (level > levelMemo.level) break;

      levelsMemo.pop();
    }

    if (!levelMemo) {
      headingsData.push(headingData);
      levelsMemo.push(headingData);
      continue;
    }

    levelMemo.children.push(headingData);
    if (level > levelMemo.level) levelsMemo.push(headingData);
  }

  return headingsData;
};
