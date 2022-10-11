import { assert, boolean, optional, record, string, type } from 'superstruct';

export const jsonFlagValueSchema = type({
  show: optional(boolean()),
  properties: record(string(), string()),
});

/**
 * Parses a JSON string into a POJO.
 * @param value
 *
 * @returns The parsed object, if the string contained a valid JSON object.
 */
export const parseJSONFlagValue = (value: string) => {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value);

    assert(parsed, jsonFlagValueSchema);

    return parsed;
  } catch (err) {
    return null;
  }
};
