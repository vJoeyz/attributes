import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMainCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-main-collection-link-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} is found, but there is no url link in the CMS Collection Item.`,
      `Add a Link Block or Text Link inside the Collection Item that links to the Item’s Template page.`
    ].join(' ');


    Object.setPrototypeOf(this, FieldLinkMainCollectionLinkNotFoundError.prototype);
  }
}
