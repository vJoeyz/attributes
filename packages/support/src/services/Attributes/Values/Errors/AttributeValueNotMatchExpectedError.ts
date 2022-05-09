import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class AttributeValueNotMatchExpectedError extends AbstractSchemaError {
  type = 'setting-value-not-match';

  constructor(attribute: SchemaSelector, domValue: string, inputValue: string) {
    super();

    const attributeId = this.toAttribute(attribute.getAttribute());

    this.message = [
      this.toHighlight(`The value of ${attributeId} does not match the entered value.`),
      `Change value "${domValue}" to value "${inputValue}".`,
    ].join(' ');
    // this.message = `Attribute ${attribute} - Expected value "${inputValue}" not match page attribute "${domValue}"`;
    // this.tips = `Change the value of attribute ${attribute} from "${domValue}" to "${inputValue}"`;

    Object.setPrototypeOf(this, AttributeValueNotMatchExpectedError.prototype);
  }
}
