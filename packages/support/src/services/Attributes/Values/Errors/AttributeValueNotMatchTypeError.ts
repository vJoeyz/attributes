import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeValueNotMatchTypeError extends AbstractSchemaError {
  type = 'setting-type-of-value-not-match';

  constructor(attribute: SchemaSelector, type: string) {
    super();

    const attributeId = this.toAttribute(attribute.getAttribute());

    this.message = [
      this.toHighlight(`The value of ${attributeId} is not in the correct format.`),
      `Change to valid ${type} format.`
    ].join(' ');

    Object.setPrototypeOf(this, AttributeValueNotMatchTypeError.prototype);
  }
}
