import type { generateDynamicAttibuteValue } from './selectors';

export type AttributeStaticValue = string;
export type AttributeDynamicValue = ReturnType<typeof generateDynamicAttibuteValue>;
export type AttributeValue = AttributeStaticValue | AttributeDynamicValue;
export type AttributeOperator = 'prefixed' | 'suffixed' | 'contains';
