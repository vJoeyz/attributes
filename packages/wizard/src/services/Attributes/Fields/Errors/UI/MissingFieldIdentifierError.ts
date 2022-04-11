import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';

export default class MissingFieldIdentifierError extends AbstractSchemaError {
  type = 'field-identifier';

  constructor() {
    super();


    this.message = [
      this.toHighlight(`Field identifier not provided.`),
      `Please enter an identifier for this field in Checker UI.`
    ].join(' ');


    Object.setPrototypeOf(this, MissingFieldIdentifierError.prototype);
  }
}
