import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';

export default class MissingFieldSpecializationError extends AbstractSchemaError {
  type = 'field-specialization';

  constructor() {
    super();

    this.message = [
      this.toHighlight(`Field element type is not entered in this tool.`),
      `Enter a field type for this field to check it on the page.`,
    ].join(' ');

    Object.setPrototypeOf(this, MissingFieldSpecializationError.prototype);
  }
}
