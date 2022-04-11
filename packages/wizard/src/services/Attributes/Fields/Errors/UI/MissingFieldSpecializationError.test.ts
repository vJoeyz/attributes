import MissingFieldSpecializationError from './MissingFieldSpecializationError';

describe('Test Error - Field Missing Specialization', () => {

  test('Field identifier not provided', () => {

    const error = new MissingFieldSpecializationError();
    expect(error.stripHTML())
    .toEqual(
      'The Field specialization was not provided. Please enter specialization for this field in Checker UI.'
    )
  });

});
