import type { CMSList, CMSItem, collectItemsProps, createCMSListInstances } from '.';

/**
 * `CMSList` Types
 */
export interface CMSListEvents {
  beforeadditems: CMSItem[];
  afteradditems: CMSItem[];
  nestinitialitems: CMSItem[];
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
  createCMSListInstances: typeof createCMSListInstances;
  collectItemsProps: typeof collectItemsProps;
}

export type CMSCoreImport = Promise<CMSCore | undefined>;
