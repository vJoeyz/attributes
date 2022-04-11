import ValueTypeValidatorError from '@src/services/Validators/Errors/ValueTypeValidatorError';

/**
 * Validate if argument is a valid string
 */
export function stringValidator(value: string | null): boolean | Error {
  try {
    if (value === undefined || value === null || value === '') {
      throw new Error();
    }

    if (!/[a-zA-Z]/.test(value)) {
      throw new Error();
    }
    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid string', 'string');
  }
}

export function commaSeparatedStringValidator(value: string): boolean | ValueTypeValidatorError {
  try {
    value.split(',').forEach((item) => {
      stringValidator(item);
    });

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid comma separated string', 'string');
  }
}
