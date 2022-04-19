import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';
import type { DOMSelector } from '@global/types/schema';

export default class AttributeConditionalNotExistError extends AbstractSchemaError {
  type = 'conditions-exists';

  constructor(
    attribute: SchemaSelector,
    conditional: SchemaSelector | null,
    appliedToConditional: DOMSelector[],
  ) {
    super();

    const selectorsLabels = this.selectorsToLabels(appliedToConditional, 'or');

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    if (conditional) {
      const conditionalId = this.toAttribute(conditional.getPrettierSelector());

      this.message = [
        this.toHighlight(
          `The attribute ${attributeId} was found but is missing the attribute dependency.`
        ),
        `Add ${conditionalId} to ${selectorsLabels} on the page.`
      ].join(' ');
    }

    if (conditional === null) {
      this.message = [
        this.toHighlight(
          `The attribute ${attributeId} was found but is missing the attribute dependency.`
        ),
        `Add ${selectorsLabels} on the page.`
      ].join(' ');
    }

    Object.setPrototypeOf(this, AttributeConditionalNotExistError.prototype);
  }
}
