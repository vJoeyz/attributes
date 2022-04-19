import type { DOMSelector } from '@global/types/schema';
import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class DOMForAttributeNotFound extends AbstractSchemaError {
  type = 'dom-not-found';

  constructor(attribute: SchemaSelector, selectors: DOMSelector[]) {
    super();

    const selectorsLabels = this.selectorsToLabels(selectors, 'or');
    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    this.message = [
      this.toHighlight(`The attribute ${attributeId} is missing required element.`),
      `Add the ${selectorsLabels} and then add the attribute ${attributeId} to it.`,
    ].join(' ');

    Object.setPrototypeOf(this, DOMForAttributeNotFound.prototype);
  }
}
