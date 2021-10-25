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
    values: string[];
    type?: string | null;
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
