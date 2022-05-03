import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMainCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-main-collection-link-not-working';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} is found, but the url link in the CMS Collection Item is not working.`,
      `Check if the Link Block or Text Link have the correct link to the Item’s Template page.`,
    ].join(' ');


    Object.setPrototypeOf(this, FieldLinkMainCollectionLinkNotFoundError.prototype);
  }
}
