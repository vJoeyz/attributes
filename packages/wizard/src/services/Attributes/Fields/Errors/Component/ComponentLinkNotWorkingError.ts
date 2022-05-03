import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class ComponentLinkNotWorkingError extends AbstractSchemaError {
  type = 'field-component-type-link-not-working';

  constructor(attribute: SchemaSelector) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      `Link for ${attributeId} is not working.`,
      `Check if the link to the external page is published and correctly entered in the attribute value.`,
    ].join(' ');
    // this.message = `Missing link in nested template page item`;
    // this.tips = ``;

    Object.setPrototypeOf(this, ComponentLinkNotWorkingError.prototype);
  }
}
