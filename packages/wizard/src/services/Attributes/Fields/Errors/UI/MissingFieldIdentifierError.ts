import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';

export default class MissingFieldIdentifierError extends AbstractSchemaError {
  type = 'field-identifier';

  constructor() {
    super();


    this.message = [
      this.toHighlight(`Field identifier is not entered in this tool.`),
      `Enter an indentifier value for this field to check it on the page.`
    ].join(' ');


    Object.setPrototypeOf(this, MissingFieldIdentifierError.prototype);
  }
}
