import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkMissingNestedCollectionError extends AbstractSchemaError {
  type = 'field-link-nested-collection-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());
    const value = attribute.getValue();

    this.message = [
      'The Collection List on the Collection Template page is not found.',
      `Add a “${value}” Collection List on the primary content Collection template page.`,
      `Add the attribute ${attributeId} to the Collection List element.`,
    ].join(' ');

    Object.setPrototypeOf(this, FieldLinkMissingNestedCollectionError.prototype);
  }
}
