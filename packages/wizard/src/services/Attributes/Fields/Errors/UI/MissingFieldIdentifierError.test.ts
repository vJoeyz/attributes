import MissingFieldIdentifierError from './MissingFieldIdentifierError';

describe('Test Error - Field Missing Identifier', () => {

  test('Field identifier not provided', () => {

    const error = new MissingFieldIdentifierError();
    expect(error.stripHTML())
    .toEqual(
      'Field identifier not provided. Please enter an identifier for this field in Checker UI.'
    )
  });

});
