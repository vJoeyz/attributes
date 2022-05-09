import MissingFieldSpecializationError from './MissingFieldSpecializationError';

describe('Test Error - Field Missing Specialization', () => {
  test('Field identifier not provided', () => {
    const error = new MissingFieldSpecializationError();
    expect(error.stripHTML()).toEqual(
      'Field element type is not entered in this tool. Enter a field type for this field to check it on the page.'
    );
  });
});
