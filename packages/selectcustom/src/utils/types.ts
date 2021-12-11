import { collectSettings } from '../actions/settings';

export type Settings = NonNullable<ReturnType<typeof collectSettings>>;

export interface OptionData {
  value: string;
  element: HTMLAnchorElement;
  labelContent: HTMLElement | null;
  selected: boolean;
  focused: boolean;
}

export type OptionsStore = OptionData[];
