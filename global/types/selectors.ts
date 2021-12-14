import type { generateDynamicAttibuteValue } from '$global/factory/selectors';

/**
 * Specific types for `generateSelectors`.
 */
export type AttributeStaticValue = string;
export type AttributeDynamicValue = ReturnType<typeof generateDynamicAttibuteValue>;
export type AttributeValue = AttributeStaticValue | AttributeDynamicValue;
export type AttributeOperator = 'prefixed' | 'suffixed' | 'contains';
