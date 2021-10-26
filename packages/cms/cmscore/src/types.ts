import type { addItemsToList, CMSList, CMSItem, collectItemsProps, createCMSListInstance } from '.';

/**
 * `CMSList` Types
 */
export interface CMSListEvents {
  beforeadditems: CMSItem[];
  afteradditems: CMSItem[];
  nestexistingitems: CMSItem[];
  nestnewitems: CMSItem[];
  finishload: undefined;
}

/**
 * `CMSItem` Types
 */
export interface CMSItemProps {
  [key: string]: {
    values: Set<string>;

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
  CMSList: typeof CMSList;
  CMSItem: typeof CMSItem;
  createCMSListInstance: typeof createCMSListInstance;
  collectItemsProps: typeof collectItemsProps;
  addItemsToList: typeof addItemsToList;
}

export type CMSCoreImport = Promise<CMSCore | undefined>;
