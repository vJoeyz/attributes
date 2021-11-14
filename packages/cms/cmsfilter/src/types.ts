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
  element: FormField;
  value: string;
  type: string;
  resultsCount: number;
  resultsElement?: HTMLElement | null;
  hideEmpty?: HTMLElement;
  hidden: boolean;
  mode?: ElementMode;
}

export interface FilterData {
  elements: FilterElement[];
  filterKeys: string[];
  values: Set<string>;
  match?: Match;
  mode?: FilterMode;
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
  element: HTMLElement;
  filterKeys: string[];
  values: string[];
  mode?: FilterMode;
}

export type TagsData = TagData[];

export type TagsFormat = 'default' | 'category';
