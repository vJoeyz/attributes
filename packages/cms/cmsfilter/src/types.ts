import type { FormField } from '@finsweet/ts-utils';
import type { MATCHES, MODES } from './constants';

/**
 * Main
 */
type Modes = typeof MODES;
export type FilterMode = keyof Modes;
export type ElementMode = Modes[FilterMode][number];

type Match = typeof MATCHES[number];

/**
 * Filters
 */
export interface FilterElement {
  element: FormField;
  value: string;
  type: string;
  mode?: ElementMode;
}

export interface FilterData {
  elements: FilterElement[];
  filterKeys: string[];
  values: Set<string>;
  match?: Match;
  mode?: FilterMode;
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
  element: HTMLElement;
  filterKeys: string[];
  value: string;
}

export type TagsData = TagData[];

export type TagsFormat = 'default' | 'category';
