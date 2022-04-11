import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMainCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-main-collection-link-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} was found, but there is no reference link to the CMS Collection Item.`,
      `Add a link to the Collection's CMS Template page.`
    ].join(' ');


    Object.setPrototypeOf(this, FieldLinkMainCollectionLinkNotFoundError.prototype);
  }
}
