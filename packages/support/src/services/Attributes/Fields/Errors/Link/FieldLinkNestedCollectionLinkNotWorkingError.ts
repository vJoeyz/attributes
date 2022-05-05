import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkNestedCollectionLinkNotWorkingError extends AbstractSchemaError {
  type = 'field-link-nested-collection-link-not-working';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} is found on the Collection’s CMS Template, but the link is not working.`,
      `Check if the link to the Item’s Template page is correct.`,
    ].join(' ');

    Object.setPrototypeOf(this, FieldLinkNestedCollectionLinkNotWorkingError.prototype);
  }
}
