import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';

export default class MissingFieldSpecializationError extends AbstractSchemaError {
  type = 'field-specialization';

  constructor() {
    super();

    this.message = [
      this.toHighlight(`The Field specialization was not provided.`),
      `Please enter specialization for this field in Checker UI.`
    ].join(' ');

    Object.setPrototypeOf(this, MissingFieldSpecializationError.prototype);
  }
}
