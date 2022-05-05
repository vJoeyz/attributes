import ValueTypeValidatorError from '@src/services/Validators/Errors/ValueTypeValidatorError';

/**
 * Validate if argument is valid option
 */
export function optionsValidator(value: string, options: string[]): boolean | Error {
  if (options.indexOf(value) === -1) {
    throw new ValueTypeValidatorError('Value is not a valid option', 'option');
  }

  return true;
}
