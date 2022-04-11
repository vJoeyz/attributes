import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkNestedCollectionLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-nested-collection-link-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} was found on the Collection’s CMS Template, but missing the link to each item.`),
      `Add a link to the Collection’s CMS Template page.`
    ].join(' ');

    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, FieldLinkNestedCollectionLinkNotFoundError.prototype);
  }
}
