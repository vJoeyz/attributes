import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class MissingFieldSettingError extends AbstractSchemaError {
  type = 'field-setting-not-found';

  constructor(attribute: SchemaSelector, field: SchemaSelector) {
    super();


    const attributeId = this.toAttribute(attribute.getPrettierSelector());
    const fieldId = this.toAttribute(field.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is not found.`),
      `Add attribute ${attributeId} to any element with ${fieldId}.`
    ].join(' ');


    Object.setPrototypeOf(this, MissingFieldSettingError.prototype);
  }
}
