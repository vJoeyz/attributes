import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class ComponentFieldNotFoundError extends AbstractSchemaError {
  type = 'field-component-not-found';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [`The attribute ${attributeId} is not found.`, `Add ${attributeId} to the page.`].join(' ');
    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, ComponentFieldNotFoundError.prototype);
  }
}
