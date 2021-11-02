import { cloneNode, Debug, sameValues } from '@finsweet/ts-utils';
import { ATTRIBUTES, getSelector } from './constants';
import { hasRemoveTrigger, updateTagText } from './tags';
import { CMSFilters } from './CMSFilters';

import type { FiltersData, TagData, TagsData, TagsFormat } from './types';
import type { CMSList } from '$cms/cmscore/src';

export class CMSTags {
  private readonly wrapper: HTMLElement;

  private tagsData: TagsData = [];
  private hasRemoveTrigger = false;

  constructor(
    private readonly template: HTMLElement,
    private readonly format: TagsFormat = 'default',
    private readonly filtersInstance: CMSFilters,
    private readonly listInstance: CMSList
  ) {
    this.wrapper = template.parentElement || Debug.alert('The tags have no parent wrapper.', 'error');

    this.init();
  }

  /**
   * Inits the instance.
   */
  private init() {
    const { template, wrapper } = this;

    template.remove();

    this.hasRemoveTrigger = hasRemoveTrigger(template);

    wrapper.addEventListener('click', (e) => this.handleClick(e));
  }

  /**
   * Handles click events on the `wrapper` element.
   * @param e The Mouse Event.
   */
  private handleClick(e: MouseEvent) {
    const { target } = e;

    if (!(target instanceof Element)) return;

    const { hasRemoveTrigger, tagsData, listInstance } = this;

    const tagElement = target.closest<HTMLElement>(
      getSelector('element', 'tagTemplate', { instanceIndex: listInstance.getInstanceIndex(ATTRIBUTES.element.key) })
    );
    if (!tagElement) return;

    const removeElement = target.closest(getSelector('element', 'tagRemove', { operator: 'prefixed' }));
    if (hasRemoveTrigger && !removeElement) return;

    const tagData = tagsData.find(({ element }) => element === tagElement);
    if (tagData) this.removeTag(tagData, true);
  }

  /**
   * Adds a new tag.
   * @param filterKeys The `filterKeys` that correspond to the tag.
   * @param value The `value` that corresponds to the tag.
   */
  private async addTag(filterKeys: TagData['filterKeys'], value: TagData['value']) {
    const {
      wrapper,
      template,
      format,
      tagsData,
      listInstance: { listAnimation },
    } = this;

    const element = cloneNode(template);

    const tagData: TagData = {
      element,
      filterKeys,
      value,
    };

    updateTagText(tagData, format);

    tagsData.push(tagData);

    if (listAnimation) {
      const { animateIn, options } = listAnimation;

      await animateIn(element, { target: wrapper, ...options });
    } else wrapper.appendChild(element);
  }

  /**
   * Updates a tag's content.
   * @param tagData A {@link TagData} record.
   * @param newValue The new value to store.
   */
  private async updateTag(tagData: TagData, newValue: string) {
    tagData.value = newValue;

    updateTagText(tagData, this.format);
  }

  /**
   * Removes an existing tag.
   * @param tagData A {@link TagData} record.
   * @param resetFilters If set to `true`, the `tagremove` event will be emitted.
   */
  private async removeTag(tagData: TagData, resetFilters?: boolean) {
    const { element, filterKeys, value } = tagData;
    const {
      tagsData,
      filtersInstance,
      listInstance: { listAnimation },
    } = this;

    // Remove the data
    this.tagsData = tagsData.filter((data) => data !== tagData);

    await Promise.all([
      // Emit events
      (async () => {
        if (resetFilters) await filtersInstance.resetFilters(filterKeys, value);
      })(),

      // Remove the element
      (async () => {
        if (listAnimation) {
          const { animateOut, options } = listAnimation;

          await animateOut(element, { remove: true, ...options });
        } else element.remove();
      })(),
    ]);
  }

  /**
   * Syncs the tags with the existing `FiltersData`.
   * @returns An awaitable Promise that resolves once all animations have concluded.
   */
  public async syncTags(filtersData: FiltersData) {
    const { tagsData } = this;

    await Promise.all(
      filtersData.map((filterData) => {
        const { filterKeys, values } = filterData;

        const existingTags = tagsData.filter((data) => sameValues(data.filterKeys, filterKeys));

        // Just update the text if it's a single value
        if (values.size === 1 && existingTags.length === 1) {
          const [tagData] = existingTags;
          const [value] = values;

          this.updateTag(tagData, value);

          return;
        }

        // Otherwise re-render the differences
        const tagsToAdd = [...values].filter((filterValue) => !existingTags.some(({ value }) => value === filterValue));
        const tagsToRemove = existingTags.filter(({ value }) => !values.has(value));

        return Promise.all([
          tagsToAdd.map((value) => this.addTag(filterKeys, value)),
          tagsToRemove.map((tagData) => this.removeTag(tagData)),
        ]);
      })
    );
  }
}
