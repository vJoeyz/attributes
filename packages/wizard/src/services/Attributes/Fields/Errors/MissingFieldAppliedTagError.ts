import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { ParentSelector, DOMSelector } from '@src/global/types/schema';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class MissingFieldAppliedTagError extends AbstractSchemaError {
  type = 'field-selector';

  constructor(attribute: SchemaSelector, parentSelector: ParentSelector | null, selectors: DOMSelector[], foundTag: string) {
    super();

    const selectorsLabels = this.selectorsToLabels(selectors, 'or');

    const attributeId = this.toAttribute(attribute.getPrettierSelector());

    if (parentSelector) {

      const parentLabels = this.parentToLabels(parentSelector);
      this.message = [
        `The attribute ${attributeId} in ${parentLabels} was found on the page but not in the correct element.`,
        `Add or move ${attributeId} to the ${selectorsLabels}.`,
      ].join(' ');
    }

    if (parentSelector === null) {
      this.message = [
        `The attribute ${attributeId} was found on the page but not in the correct element.`,
        `Add or move ${attributeId} to the ${selectorsLabels}.`,
      ].join(' ');
    }

    Object.setPrototypeOf(this, MissingFieldAppliedTagError.prototype);
  }
}
