/**
 * Sorting
 */
export type SortItemsCallback = (addingItems?: boolean | undefined) => Promise<void>;

/**
 * Buttons
 */
export type SortingDirection = 'asc' | 'desc';
export type CSSClasses = Record<SortingDirection, string>;

/**
 * Dropdown
 */
export interface DropdownOption {
  element: HTMLAnchorElement;
  sortKey?: string;
  direction?: SortingDirection;
  selected: boolean;
}

export type DropdownOptions = DropdownOption[];

export type DropdownLabelData = {
  element: Element;
  originalHTML: string;
  updateContent: (option: DropdownOption) => void;
};
