import type { FormField } from '@finsweet/ts-utils';
import type { MATCHES, MODES } from './constants';

type Modes = typeof MODES;
export type FilterMode = keyof Modes;
export type ElementMode = Modes[FilterMode][number];

type Match = typeof MATCHES[number];

export interface FilterElement {
  element: FormField;
  fixedValue?: string | null;
  mode?: ElementMode;
  type: string;
}

export interface FilterData {
  elements: FilterElement[];
  filterKeys: Set<string>;
  values: Set<string | undefined>;
  match?: Match;
  mode?: FilterMode;
}

export type FiltersData = FilterData[];

export type ResetButtonsData = Map<HTMLElement, string | null>;
