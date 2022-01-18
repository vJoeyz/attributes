export interface AttributeSchema {
  elements: AttributeElementSchema[];
  settings: AttributeSettingSchema[];
  fields?: AttributeFieldSchema[];
}

/**
 * Defines the schema for a CMS Collection or CMS Collection Field
 */
interface AttributeFieldSchema {
  key: string;
  description: string;
  specializations: FieldSpecialization[];
  // appliedTo: string[];
}

/**
 * Defines the field specialization (Multiple places in html can have the same field)
 */
interface FieldSpecialization {
  key: string;
  appliedTo: InstanceFieldSpecialization[];
}

/**
 * Defines setting specialization (Settings with multiple fields)
 */
interface SettingSpecialization {
  value: string;
}

/**
 * Defines the model for set field specialization in one place of html
 */
interface InstanceFieldSpecialization {
  /** Expected parent where the field belong */
  parent: string | null;
  /** Expected selectors where the field can belong */
  selectors: string[];
  /** Expected custom key for field */
  key?: string;
  /** Expected custom value for field */
  value?: string;
}

/**
 * Defines the schema for an element attribute (`fs-ATTRIBUTE-element="ELEMENT_KEY"`).
 */
interface AttributeElementSchema {
  /**
   * Represents an element reference like `fs-ATTRIBUTE-element="ELEMENT_KEY"`
   */
  key: string;

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
  conditions: (
    | AttributeElementElementCondition
    | AttributeElementSelectorCondition
    | AttributeSettingSettingsCondition
  )[];
}

interface AttributeElementCondition {
  /**
   * Defines the type of the condition.
   */
  type: 'exists' | 'isChildOf' | 'isParentOf' | 'isSiblingOf';
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
   * Represents a setting reference like `fs-ATTRIBUTE-SETTING_KEY="SETTING_VALUE"`
   */
  key: string;

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

    /**
     * Defines the field selectors
     */
    fields?: string[];

    specializations?: string[];
  };

  /**
   * The possible SETTING_VALUEs to define.
   */
  value: AttributeSettingValuePrimitive | AttributeSettingValueOptions;

  /**
   * Possible behaviors to apply to this setting.
   */
  specializations?: SettingSpecialization[];

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
  type: 'exists' | 'isChildOf' | 'isParentOf' | 'isSiblingOf';
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
