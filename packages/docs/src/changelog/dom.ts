import MarkdownIt from 'markdown-it';
import { AttributeChangesets } from '$utils/types/changesets';
import { cloneNode } from '@finsweet/ts-utils';
import { getSelector } from '../utils/constants';
import { AttributesData } from '../utils/types';

const markdownIt = new MarkdownIt();

/**
 * Creates a new `Collection Item` element from a changeset's data.
 * @param attributeData The data from the current attribute.
 * @param changeset The changeset data.
 * @param templateElement The `Collection Item` template element.
 *
 * @returns A new node populated with the changeset data.
 */
export const createChangesetElement = (
  { title, key }: AttributesData[number],
  { date, version, markdown }: AttributeChangesets[number],
  templateElement: HTMLDivElement
) => {
  const newElement = cloneNode(templateElement);

  const titleElement = newElement.querySelector(getSelector('element', 'attributeTitle')) as HTMLElement;
  const keyElement = newElement.querySelector(getSelector('element', 'attributeKey')) as HTMLElement;
  const versionElement = newElement.querySelector(getSelector('element', 'attributeVersion')) as HTMLElement;
  const changesetElement = newElement.querySelector(getSelector('element', 'attributeChangeset')) as HTMLElement;
  const dateElement = newElement.querySelector(getSelector('element', 'attributeDate')) as HTMLElement;

  titleElement.textContent = title;
  keyElement.textContent = key;
  versionElement.textContent = version;
  changesetElement.innerHTML = markdownIt.render(markdown);
  dateElement.textContent = new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return newElement;
};
