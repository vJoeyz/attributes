import ValueTypeValidatorError from '@src/services/Validators/Errors/ValueTypeValidatorError';

/**
 * Validate if argument is a valid float.
 */
export function floatValidator(value: string): boolean | Error {
  try {
    if (value.match(/[,a-zA-Z]/)) {
      throw new ValueTypeValidatorError('Value is not a valid float', 'float');
    }

    const convertedValue = parseFloat(value);

    if (typeof convertedValue !== 'number' || isNaN(convertedValue) === true) {
      throw new Error();
    }

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid float', 'float');
  }
}

/**
 * Validate if argument is a comma separated float.
 */
export function commaSeparatedFloatValidator(value: string): boolean | Error {
  try {
    value.split(',').forEach((item) => {
      floatValidator(item);
    });

    return true;
  } catch (e) {
    throw new ValueTypeValidatorError('Value is not a valid comma separated float', 'comma separated float');
  }
}
