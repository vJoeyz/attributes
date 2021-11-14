import type { FormField } from '@finsweet/ts-utils';
import type { MATCHES, MODES } from './constants';

/**
 * Main
 */
type Modes = typeof MODES;
type FilterMode = keyof Modes;
type ElementMode = Modes[FilterMode][number];

type Match = typeof MATCHES[number];

/**
 * Filters
 */
export interface FilterElement {
  /**
   * Defines the element that holds the filter value.
   */
  element: FormField;

  /**
   * The filter value.
   */
  value: string;

  /**
   * The Form Field type of the element.
   */
  type: string;

  /**
   * The amount of results for this particular element.
   */
  resultsCount: number;

  /**
   * An text element where to display the `resultsCount`.
   */
  resultsElement?: HTMLElement | null;

  /**
   * Defines if the element should be hidden when there are no `resultsCount`.
   */
  hideEmpty?: HTMLElement;

  /**
   * Defines if the element is currently hidden.
   */
  hidden: boolean;

  /**
   * Defines a {@link ElementMode}.
   */
  mode?: ElementMode;
}

export interface FilterData {
  /**
   * The elements that filter by the `filterKeys` of this filter.
   */
  elements: FilterElement[];

  /**
   * The `filterKey` indentifiers.
   */
  filterKeys: string[];

  /**
   * The current active values.
   */
  values: Set<string>;

  /**
   * The {@link Match} rule.
   */
  match?: Match;

  /**
   * A {@link FilterMode}.
   */
  mode?: FilterMode;

  /**
   * Defines if matching `CMSItemProps` should be highlighted.
   */
  highlight: boolean;
}

export type FiltersData = FilterData[];

/**
 * Reset Buttons
 */
export type ResetButtonsData = Map<HTMLElement, string[]>;

/**
 * Tags
 */
export interface TagData {
  /**
   * The tag element.
   */
  element: HTMLElement;

  /**
   * The {@link FilterData.filterKeys} that represent this tag.
   */
  filterKeys: string[];

  /**
   * The {@link FilterData.values} that represent this tag.
   */
  values: string[];

  /**
   * A {@link FilterMode}.
   */
  mode?: FilterMode;

  /**
   * Defines an override name for the `filterKeys` display.
   */
  filterKeysOverride?: string;
}

export type TagsData = TagData[];

export type TagsFormat = 'default' | 'category';
