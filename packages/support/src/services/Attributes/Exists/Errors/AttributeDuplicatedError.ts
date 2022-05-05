import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeDuplicateError extends AbstractSchemaError {
  type = 'attribute-duplicated';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is found duplicated on the page.`),
      `Remove the duplicated attributes from the page.`,
    ].join(' ');


    Object.setPrototypeOf(this, AttributeDuplicateError.prototype);
  }
}
