import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkNestedCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-nested-collection-link-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is found on the Collection’s Template page, but is missing the url link to each item.`),
      `Add a Link Block or Text Link inside the Collection Item on the CMS Template page.`
    ].join(' ');

    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, FieldLinkNestedCollectionLinkNotFoundError.prototype);
  }
}
