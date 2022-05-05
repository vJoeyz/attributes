import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class FieldLinkNotFoundError extends AbstractSchemaError {
  type = 'field-link-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `The attribute ${attributeId} is not found on the page.`,
      `Add this attribute to a Div Block in the primary Collection List.`,
      'Additionally add this attribute to the hidden Collection List that will be nested.',
    ].join(' ');
    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, FieldLinkNotFoundError.prototype);
  }
}
