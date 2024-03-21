import { type AttributeElements, type AttributeSettings, INPUT_COUNTER_ATTRIBUTE } from '@finsweet/attributes-utils';

export const ELEMENTS = [
  /**
   * Defines the input element.
   */
  'input',

  /**
   * Defines an increment button.
   */
  'increment',

  /**
   * Defines an decrement button.
   */
  'decrement',

  /**
   * Defines a reset button.
   */
  'clear',

  /**
   * Defines the stylesheet that contains the hide arrows CSS.
   */
  'style',
] as const satisfies AttributeElements;

export const SETTINGS = {
  /**
   * Defines the initial value for the numeric input.
   */
  initial: {
    key: 'initial',
  },

  /**
   * Defines if the native number input arrows should be displayed.
   */
  showarrows: {
    key: 'showarrows',
  },
} as const satisfies AttributeSettings;

export const HIDE_ARROWS_STYLE = `<style fs-${INPUT_COUNTER_ATTRIBUTE}-element="style">
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type='number'] {
  -moz-appearance: textfield;
}
</style>`;
