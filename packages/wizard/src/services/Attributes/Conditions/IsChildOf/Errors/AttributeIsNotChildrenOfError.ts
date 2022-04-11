import type { DOMSelector } from '@src/global/types/schema';
import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector, AppliedToSelector } from '@src/types/Schema.types';

export default class AttributeIsNotChildrenOfSelectorError extends AbstractSchemaError {
  type = 'conditions-isChildOf';

  constructor(attribute: SchemaSelector, childOfSelectors: DOMSelector[][]) {
    super();

    const selectors = childOfSelectors.map((selectorsGroup: DOMSelector[]) => {

      return this.selectorsToLabels(selectorsGroup, 'or');
    }).join(' and ');


    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} was found but not in the correct location.`),
      `Move attribute ${attributeId} as children of the ${selectors}`
    ].join(' ');

    Object.setPrototypeOf(this, AttributeIsNotChildrenOfSelectorError.prototype);
  }
}
