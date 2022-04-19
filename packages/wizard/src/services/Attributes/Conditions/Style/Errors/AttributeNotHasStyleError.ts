import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';
import type { AttributeStyleConditionStyles } from '@global/types/schema';

export default class AttributeIsNotParentOfElementError extends AbstractSchemaError {
  type = 'conditions-hasStyles';

  constructor(attribute: SchemaSelector, style: AttributeStyleConditionStyles) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(
        `The attribute ${attributeId} was found but not match required style.`
      ),
      `In the element with this attribute, set property "${style.property}" as "${style.value}".`
    ].join(' ');

    Object.setPrototypeOf(this, AttributeIsNotParentOfElementError.prototype);
  }
}
