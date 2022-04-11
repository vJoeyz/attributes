import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class ComponentMissingExternalComponentError extends AbstractSchemaError {
  type = 'field-component-type-missing-external-component';

  constructor(attribute: SchemaSelector, component: SchemaSelector) {
    super();


    const attributeId = this.toAttribute(attribute.getPrettierSelector());
    const componentId = this.toAttribute(component.getPrettierSelector());

    this.message = [
      this.toHighlight(`External component for ${attributeId} not found.`),
      `Add attribute ${componentId} on external page component to make it work.`
    ].join(' ');
    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, ComponentMissingExternalComponentError.prototype);
  }
}
