import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeIsNotParentOfElementError extends AbstractSchemaError {
  type = 'conditions-hasLink';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is found, but missing a required link in the Collection Item.`),
      `Add a Link Block or Text Link to the Collection Item and link it to the Collection Item’s template page.`,
    ].join(' ');

    Object.setPrototypeOf(this, AttributeIsNotParentOfElementError.prototype);
  }
}
