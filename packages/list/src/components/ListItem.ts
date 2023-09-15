import {
  type CollectionItemElement,
  type CollectionListElement,
  normalizeDate,
  normalizeNumber,
} from '@finsweet/attributes-utils';

import { normalizeFieldKey } from '../utils/fields';
import { getAttribute, getSettingSelector } from '../utils/selectors';

type ListItemFields = {
  [field: string]: {
    type: 'text' | 'date' | 'number';
  } & (
    | {
        type: 'text';
        isRange: false;
        value: string;
      }
    | {
        type: 'date';
        isRange: false;
        value: Date;
      }
    | {
        type: 'number';
        isRange: false;
        value: number;
      }
    | {
        type: 'text';
        isRange: true;
        values: string[];
      }
    | {
        type: 'date';
        isRange: true;
        values: Date[];
      }
    | {
        type: 'number';
        isRange: true;
        values: number[];
      }
  );
};

/**
 * An instance of a list item.
 */
export class ListItem {
  /**
   * The URL of the item's `Template Page`.
   */
  public readonly href?: string;

  /**
   * The item's properties.
   * Defined by {@link ListItemFields}.
   */
  public fields: ListItemFields = {};

  /**
   * The element's current index in the rendered DOM.
   */
  public currentIndex?: number;

  /**
   * Defines if the item needs a Webflow modules restart.
   */
  public needsWebflowRestart: boolean;

  /**
   * @param element The DOM element of the item.
   * @param listElement The parent Collection List.
   */
  constructor(
    /**
     * The `Collection Item` element.
     */
    public readonly element: CollectionItemElement,

    /**
     * The `Collection List` parent element.
     */
    public readonly listElement: CollectionListElement
  ) {
    this.href = element.querySelector('a')?.href;

    this.currentIndex = [...listElement.children].indexOf(element);

    const rendered = this.currentIndex >= 0;

    this.needsWebflowRestart = !rendered;

    this.collectFields();
  }

  /**
   * Collects the field values from child elements and stores them.
   */
  public collectFields() {
    const { element, fields } = this;

    const fieldElements = [...element.querySelectorAll<HTMLElement>(getSettingSelector('field'))];

    for (const element of fieldElements) {
      const fieldKey = normalizeFieldKey(getAttribute(element, 'field'));
      if (!fieldKey) continue;

      const rawValue = element.textContent;
      if (!rawValue) continue;

      const type = getAttribute(element, 'type', true) || 'text';
      const range = getAttribute(element, 'range', true);

      const isRange = !!range;

      const value =
        type === 'number' ? normalizeNumber(rawValue) : type === 'date' ? normalizeDate(rawValue) : rawValue;

      if (value === undefined) continue;

      fields[fieldKey] ||= isRange ? { type, isRange, values: [] } : { type, isRange, value: value as any };

      const prop = fields[fieldKey];

      if (prop.isRange) {
        if (range === 'from') {
          prop.values[0] ||= value;
        } else {
          prop.values[1] ||= value;
        }
      }
    }
  }
}
