import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMainCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-main-collection-link-not-working';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} link was found, but not working`,
      `Check if link is correctly direction to CMS Collection's Item`,
    ].join(' ');


    Object.setPrototypeOf(this, FieldLinkMainCollectionLinkNotFoundError.prototype);
  }
}
