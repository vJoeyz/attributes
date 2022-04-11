import ValueTypeValidatorError from '@src/services/Validators/Errors/ValueTypeValidatorError';

/**
 * Validate if argument is a valid boolean.
 */
export function booleanValidator(value: string): boolean | Error {
  let convertedValue;

  try {
    convertedValue = JSON.parse(value);

    if (typeof convertedValue !== 'boolean') {
      throw new Error();
    }

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid boolean', 'boolean');
  }
}
