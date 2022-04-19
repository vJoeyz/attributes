<script lang="ts">
  import SelectorCustomAttribute from './SelectorCustomAttribute.svelte';
  import SelectorCustomValue from './SelectorCustomValue.svelte';
  import SelectorButton from './SelectorButton.svelte';
  import SelectorCustomAttributeValueText from './SelectorCustomValueText.svelte';
  import SelectorOptions from './SelectorOptions.svelte';
  import type { AttributeSettingValuePrimitive, AttributeSettingValueOptions } from '@global/types/schema';

  export let label: 'Name' | 'Value';

  export let option: string;
  export let isActive: boolean;
  export let onChange: any;

  export let valueType: AttributeSettingValueOptions | AttributeSettingValuePrimitive;

</script>

<SelectorCustomAttribute>
  {label}
</SelectorCustomAttribute>
<SelectorCustomValue>
  <SelectorCustomAttributeValueText>
    <SelectorOptions
      onChange={onChange}
      isActive={isActive}
      id="selector"
      value={valueType}
      option={option}
    />

  </SelectorCustomAttributeValueText>
  <div class="selector-button">
    <SelectorButton selector={option}/>
  </div>
</SelectorCustomValue>

<style>
  .selector-button {
    padding-top: 0.20rem;
    align-self: flex-start;
  }
</style>
