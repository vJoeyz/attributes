import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkNestedCollectionLinkNotWorkingError extends AbstractSchemaError {
  type = 'field-link-nested-collection-link-not-working';

  constructor(attribute: SchemaSelector) {
    super();


    const attributeId = this.toAttribute(attribute.getPrettierSelector());


    this.message = [
      `The attribute ${attributeId} was found on the Collection’s CMS Template, but link is not working.`,
      `Verify the link on the Collection’s CMS Template page.`
    ].join(' ');


    Object.setPrototypeOf(this, FieldLinkNestedCollectionLinkNotWorkingError.prototype);
  }
}
