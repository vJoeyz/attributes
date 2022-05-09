import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class ComponentMissingExternalComponentError extends AbstractSchemaError {
  type = 'field-component-type-missing-external-component';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is not found on the external page.`),
      `Add this attribute on the external page component.`,
    ].join(' ');

    Object.setPrototypeOf(this, ComponentMissingExternalComponentError.prototype);
  }
}
