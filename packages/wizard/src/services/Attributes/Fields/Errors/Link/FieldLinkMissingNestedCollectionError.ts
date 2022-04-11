import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMissingNestedCollectionError extends AbstractSchemaError {
  type = 'field-link-nested-collection-not-found';

  constructor(attribute: SchemaSelector) {
    super();


    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The Nested Collection List for ${attributeId} on the Collection Template page was not found.`,
      `Add a Nested Collection List on the Collection template Page with the ${attributeId} attribute.`
    ].join(' ');

    // this.message = `Missing collection in item collection items`;
    // this.tips = ``;

    Object.setPrototypeOf(this, FieldLinkMissingNestedCollectionError.prototype);
  }
}
