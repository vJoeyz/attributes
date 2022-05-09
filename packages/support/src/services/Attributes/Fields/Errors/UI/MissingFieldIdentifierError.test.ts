import MissingFieldIdentifierError from './MissingFieldIdentifierError';

describe('Test Error - Field Missing Identifier', () => {
  test('Field identifier not provided', () => {
    const error = new MissingFieldIdentifierError();
    expect(error.stripHTML()).toEqual(
      'Field identifier is not entered in this tool. Enter an indentifier value for this field to check it on the page.'
    );
  });
});
