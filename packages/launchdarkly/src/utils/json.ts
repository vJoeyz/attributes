import { boolean, optional, record, string, type } from 'superstruct';

/**
 * Defines the JSON Flag Value schema.
 */
export const jsonFlagValueSchema = type({
  show: optional(boolean()),
  properties: record(string(), string()),
});
