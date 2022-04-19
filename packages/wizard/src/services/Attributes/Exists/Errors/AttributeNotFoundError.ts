import type { DOMSelector } from '@global/types/schema';
import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeNotFoundError extends AbstractSchemaError {
  type = 'attribute-not-found';

  constructor(attribute: SchemaSelector, selectors: DOMSelector[]) {
    super();

    const selectorsLabels = this.selectorsToLabels(selectors, 'or');
    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} was not found.`),
      `Add ${attributeId} to the ${selectorsLabels} on the page.`,
    ].join(' ');

    Object.setPrototypeOf(this, AttributeNotFoundError.prototype);
  }
}
