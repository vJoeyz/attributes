import ValueTypeValidatorError from '@src/services/Validators/Errors/ValueTypeValidatorError';

/**
 * Validate if argument is a valid int
 */
export function intValidator(value: string): boolean | Error {
  try {
    if (value.match(/[.a-zA-Z]/)) {
      throw new ValueTypeValidatorError('Value is not a valid int', 'int');
    }

    const convertedValue = parseInt(value);

    if (typeof convertedValue !== 'number' || isNaN(convertedValue) === true) {
      throw new Error();
    }

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid int', 'int');
  }
}

/**
 * Validate if argument is a valid comma separated int.
 */
export function commaSeparatedIntValidator(value: string): boolean | Error {
  try {
    value.split(',').forEach((item) => {
      intValidator(item);
    });

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid comma separated int', 'comma separated int');
  }
}
