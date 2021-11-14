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
   * @param values The `value` that corresponds to the tag.
   */
  private async addTag(filterKeys: TagData['filterKeys'], values: TagData['values'], mode?: TagData['mode']) {
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
      values,
      mode,
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
   * @param newValues The new value to store.
   */
  private async updateTag(tagData: TagData, newValues: string[]) {
    tagData.values = newValues;

    updateTagText(tagData, this.format);
  }

  /**
   * Removes an existing tag.
   * @param tagData A {@link TagData} record.
   * @param resetFilters If set to `true`, the `tagremove` event will be emitted.
   */
  private async removeTag(tagData: TagData, resetFilters?: boolean) {
    const { element, filterKeys, values } = tagData;
    const {
      tagsData,
      filtersInstance,
      listInstance: { listAnimation },
    } = this;

    // Remove the data
    this.tagsData = tagsData.filter((data) => data !== tagData);

    await Promise.all([
      // Reset filters
      Promise.all(
        values.map(async (value) => {
          if (resetFilters) return filtersInstance.resetFilters(filterKeys, value);
        })
      ),

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
        const { filterKeys, values, mode: filterMode } = filterData;

        const filterValues = [...values];

        const existingTags = tagsData.filter(
          ({ filterKeys: tagKeys, mode: tagMode }) => filterMode === tagMode && sameValues(tagKeys, filterKeys)
        );

        // Just update the text if it's a single value or a range
        if (
          existingTags.length === 1 &&
          (filterValues.length === 1 || (filterMode === 'range' && filterValues.length))
        ) {
          const [tagData] = existingTags;

          this.updateTag(tagData, filterValues);

          return;
        }

        // Otherwise re-render the differences
        const valuesToAdd = [...filterValues].filter(
          (filterValue) => !existingTags.some(({ values }) => values.includes(filterValue))
        );

        const tagsToRemove = existingTags.filter(({ values }) =>
          values.every((value) => !filterValues.includes(value))
        );

        return Promise.all([
          // Add tags
          (async () => {
            if (filterMode === 'range' && valuesToAdd.length) return this.addTag(filterKeys, valuesToAdd, filterMode);

            return Promise.all(valuesToAdd.map((value) => this.addTag(filterKeys, [value])));
          })(),

          // Remove tags
          Promise.all(tagsToRemove.map((tagData) => this.removeTag(tagData))),
        ]);
      })
    );
  }
}
