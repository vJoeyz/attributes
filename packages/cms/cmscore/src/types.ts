import type { CMSList, CMSItem, createCMSListInstances } from '.';

/**
 * `CMSList` Types
 */
export interface CMSListEvents {
  shouldnest: CMSItem[];
  shouldcollectprops: CMSItem[];
  shouldsort: CMSItem[];
  shouldfilter: undefined;

  renderitems: CMSItem[];
  additems: CMSItem[];

  switchpage: number;

  nestinitialitems: CMSItem[];

  finishload: undefined;
}

/**
 * `CMSItem` Types
 */
export interface CMSItemProps {
  [key: string]: {
    /**
     * Defines the prop values.
     */
    values: Set<string>;

    /**
     * Defines the elements that hold the prop values.
     * The Map is used as [propValue, element].
     */
    elements: Map<
      string,
      {
        element: HTMLElement;
        originalHTML: string;
      }
    >;

    /**
     * Defines filter values to highlight in a Map like:
     * ```
     * [propValue, filterValue | null]
     * ```
     */
    highlightValues?: Map<string, string | null>;

    /**
     * Defines the type of the value.
     * @example `date`
     */
    type?: string | null;

    /**
     * Defines the mode of the prop.
     * @example `from` | `to`.
     */
    range?: string | null;
  };
}

/**
 * Dynamic Import type
 */
export interface CMSCore {
  version: string;
  CMSList: typeof CMSList;
  CMSItem: typeof CMSItem;
  createCMSListInstances: typeof createCMSListInstances;
}

export type CMSCoreImport = Promise<CMSCore | undefined>;
