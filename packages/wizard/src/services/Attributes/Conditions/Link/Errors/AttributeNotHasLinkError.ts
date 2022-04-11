import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeIsNotParentOfElementError extends AbstractSchemaError {
  type = 'conditions-hasLink';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(
        `The attribute ${attributeId} was found but missing required link to collection item.`
      ),
      `Add a link to collection item for every element on list.`
    ].join(' ');

    Object.setPrototypeOf(this, AttributeIsNotParentOfElementError.prototype);
  }
}
