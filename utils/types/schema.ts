export interface AttributeSchema {
  elements: {
    /**
     * Each `ELEMENT_KEY` represents an element reference like `fs-ATTRIBUTE-element="ELEMENT_KEY"`
     */
    [ELEMENT_KEY: string]: AttributeElementSchema;
  };
  settings: {
    /**
     * Each `SETTING_KEY` represents a setting reference like `fs-ATTRIBUTE-SETTING_KEY="SETTING_VALUE"`
     */
    [SETTING_KEY: string]: AttributeSettingSchema;
  };
}

/**
 * Defines the schema for an element attribute (`fs-ATTRIBUTE-element="ELEMENT_KEY"`).
 */
interface AttributeElementSchema {
  /**
   * The description of the element.
   */
  description: string;

  /**
   * Defines if it's required to have it defined.
   */
  required: boolean;

  /**
   * Defines the available elements' selector that this attribute can be defined.
   * @example
   * ```
   * ['.w-dyn-list', '.w-dyn-items']
   * ```
   * Means that this attribute can be applied to an element that matches any of both selectors (use [Element.matches()](https://developer.mozilla.org/en-US/docs/Web/API/Element/matches)).
   *
   * If the array is empty, it means that this attribute can be applied to any element on the page.
   */
  appliedTo: string[];

  /**
   * Defines if this element requires an instance like `element-1` | `element-2`.
   * If `true`, all conditions that refer this element must also match the instance.
   */
  requiresInstance: boolean;

  /**
   * Defines the conditions that this element must match to be valid.
   */
  conditions: (AttributeElementElementCondition | AttributeElementSelectorCondition)[];
}

interface AttributeElementCondition {
  /**
   * Defines the type of the condition.
   */
  type: 'exists' | 'isChildOf' | 'isParentOf';
}

type AttributeElementElementCondition = AttributeElementCondition & {
  /**
   * Defines an `ELEMENT_KEY` from the schema.
   */
  element?: string;
};

type AttributeElementSelectorCondition = AttributeElementCondition & {
  /**
   * Defines an element selector.
   */
  selector?: string;
};

/**
 * Defines the schema for a setting attribute (`fs-ATTRIBUTE-SETTING_KEY="VALUE"`).
 */
interface AttributeSettingSchema {
  /**
   * The description of the setting.
   */
  description: string;

  /**
   * Defines where this attribute can be applied.
   */
  appliedTo: {
    /**
     * Defines `ELEMENT_KEY`s from the schema.
     */
    elements?: string[];

    /**
     * Defines element selectors.
     */
    selectors?: string[];
  };

  /**
   * The possible value/values to define.
   */
  value: AttributeSettingValuePrimitive | AttributeSettingValueOptions;

  /**
   * The conditions that other elements/settings must match.
   */
  conditions: (AttributeSettingMainCondition | AttributeSettingSettingsCondition)[];
}

interface AttributeSettingValue {
  /**
   * Shows if the attribute uses a default value when this setting is not set.
   */
  default?: string;
}

type AttributeSettingValuePrimitive = AttributeSettingValue & {
  /**
   * The type of the value.
   */
  type: 'string' | 'boolean' | 'int' | 'float' | 'commaSeparatedFloat' | 'commaSeparatedInt' | 'commaSeparatedString';
};

type AttributeSettingValueOptions = AttributeSettingValue & {
  /**
   * The type of the value.
   */
  type: 'options';

  /**
   *
   */
  options: Array<{ value: string; description: string }>;
};

interface AttributeSettingElementCondition {
  /**
   * Defines an `ELEMENT_KEY` from the schema.
   */
  element?: string;
}

interface AttributeSettingSelectorCondition {
  /**
   * Defines an element selector.
   */
  selector?: string;
}

type AttributeSettingMainCondition = (AttributeSettingElementCondition | AttributeSettingSelectorCondition) & {
  /**
   * The type of the value.
   */
  type: 'exists' | 'isChildOf' | 'isParentOf';
};

type AttributeSettingSettingsCondition = (AttributeSettingElementCondition | AttributeSettingSelectorCondition) & {
  /**
   * The type of the value.
   */
  type: 'settings';

  settings: Array<{
    /**
     * Defines a `SETTING_KEY` from the schema.
     */
    key: string;

    /**
     * Defines a setting value from the schema.
     */
    value: string;
  }>;
};
