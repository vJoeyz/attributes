import {
  type FormFieldType,
  isDate,
  isString,
  isUndefined,
  normalizeDate,
  normalizeNumber,
} from '@finsweet/attributes-utils';

import type { ListItemField } from '../components';

/**
 * Parses the filter value based on the field type.
 * @param rawFilterValue
 * @param fieldData
 * @returns The parsed filter value, if it could be parsed. Otherwise, `null`.
 */
export const parseFilterValue = (
  rawFilterValue: string | number | Date,
  filterType: FormFieldType,
  fieldType?: ListItemField['type']
) => {
  if (
    fieldType === 'date' ||
    filterType === 'date' ||
    filterType === 'time' ||
    filterType === 'datetime-local' ||
    filterType === 'month' ||
    filterType === 'week'
  ) {
    const filterValue = normalizeDate(rawFilterValue);

    if (filterValue === undefined || isNaN(filterValue.getTime())) {
      return null;
    }

    return filterValue;
  }

  if (fieldType === 'number' || filterType === 'number' || filterType === 'range') {
    const filterValue = normalizeNumber(rawFilterValue);

    if (filterValue === undefined || isNaN(filterValue)) {
      return null;
    }

    return filterValue;
  }

  return rawFilterValue;
};
/**
 * Checks if two values are equal.
 * @param rawA
 * @param rawB
 */
export const areEqual = (rawA: string | number | Date, rawB: string | number | Date) => {
  // Ensure that dates are compared as dates
  if (typeof rawA !== typeof rawB) {
    if (isDate(rawA)) {
      rawB = normalizeDate(rawB) || rawB;
    } else if (isDate(rawB)) {
      rawA = normalizeDate(rawA) || rawA;
    }
  }

  const a = isDate(rawA) ? rawA.getTime() : isString(rawA) ? rawA.toLowerCase() : rawA;
  const b = isDate(rawB) ? rawB.getTime() : isString(rawB) ? rawB.toLowerCase() : rawB;

  return a === b;
};
/**
 * Compares two numeric values.
 * @param rawA
 * @param rawB
 * @param op
 * @returns `true` if the comparison is successful.
 */
export const numericCompare = (
  rawA: string | number | Date,
  rawB: string | number | Date,
  op: 'greater' | 'greater-equal' | 'less' | 'less-equal'
) => {
  const a = isDate(rawA) ? rawA.getTime() : isString(rawA) ? normalizeNumber(rawA) : rawA;
  const b = isDate(rawB) ? rawB.getTime() : isString(rawB) ? normalizeNumber(rawB) : rawB;

  if (isUndefined(a) || isUndefined(b)) return false;

  if (op === 'greater') return a > b;
  if (op === 'greater-equal') return a >= b;
  if (op === 'less') return a < b;
  if (op === 'less-equal') return a <= b;

  return false;
};
