import { Debug, extractNumberSuffix } from '@finsweet/ts-utils';
import { ATTRIBUTES } from './constants';
import { GlobalAttributeParams } from './types/global';

/**
 * Makes sure the window object is defined.
 */
export const initAttributes = () => {
  window.fsAttributes ||= {
    cms: {},
  };
};

/**
 * Checks the global params of the Attribute `<script>`.
 * @param script The `<script>` element.
 * @returns The {@link GlobalAttributeParams}.
 */
export const assessScript = (script: HTMLOrSVGScriptElement | null): GlobalAttributeParams => {
  const { preventLoad, debugMode } = ATTRIBUTES;

  // Check if the Attribute should not be automatically loaded
  const preventsLoad = typeof script?.getAttribute(preventLoad.key) === 'string';

  // Check if Debug Mode is activated
  if (typeof script?.getAttribute(debugMode.key) === 'string') Debug.activateAlerts();

  return { preventsLoad };
};

/**
 * Creates a dynamic attribute value.
 * @param value The static attribute value.
 * @returns A callback for generating new attribute values by index.
 */
export const generateDynamicAttibuteValue = (value: string) => {
  return (index?: number): string => `${value}${index ? `-${index}` : ''}`;
};

/**
 * Specific types for `generateSelectors`.
 */
type AttributeStaticValue = string;
type AttributeDynamicValue = ReturnType<typeof generateDynamicAttibuteValue>;
type AttributeValue = AttributeStaticValue | AttributeDynamicValue;
type AttributeOperator = 'prefixed' | 'suffixed' | 'contains';

/**
 * @returns A `getSelector` callback for the passed `attributes` object.
 * @param attributes An object containing all attribute keys and values.
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const generateSelectors = <
  Attributes extends {
    [name: string]: {
      key: string;
      values?: {
        [valueKey: string]: AttributeValue;
      };
    };
  }
>(
  attributes: Attributes
) => {
  /**
   * Generates a query selector based on the preferences.
   * @param name The name of the attribute.
   * @param valueKey The value of the attribute.
   * @param params.index Only accepted when the value is dynamic.
   * @param params.operator Optional operator for the selector.
   * @returns The query selector based on the preferences.
   */
  const getSelector = <Name extends keyof Attributes, ValueKey extends keyof Attributes[Name]['values']>(
    name: Name,
    valueKey?: ValueKey,
    params?: Attributes[Name]['values'][ValueKey] extends AttributeStaticValue
      ? {
          operator?: AttributeOperator;
        }
      : {
          instanceIndex?: number;
          operator?: AttributeOperator;
        }
  ): string => {
    const attribute = attributes[name];

    const { key: attributeKey, values } = attribute;
    let attributeValue: string;

    if (!valueKey) return `[${attributeKey}]`;

    const value = values?.[valueKey] as AttributeValue;

    if (typeof value === 'string') attributeValue = value;
    else attributeValue = value(params && 'instanceIndex' in params ? params.instanceIndex : undefined);

    if (!params?.operator) return `[${attributeKey}="${attributeValue}"]`;

    switch (params.operator) {
      case 'prefixed':
        return `[${attributeKey}^="${attributeValue}"]`;
      case 'suffixed':
        return `[${attributeKey}$="${attributeValue}"]`;
      case 'contains':
        return `[${attributeKey}*="${attributeValue}"]`;
    }
  };

  return getSelector;
};

/**
 * Gets the instance index of an element attribute.
 * @example An element with the `fs-copyclip-element="trigger-1"` attribute will return `1` as the instance index.
 * @param element The element to extract the instance index.
 * @param attributeKey The attribute key that holds the instance index.
 */
export const getInstanceIndex = (element: Element, attributeKey: string): number | undefined => {
  const elementValue = element.getAttribute(attributeKey);
  const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : undefined;

  return instanceIndex;
};
