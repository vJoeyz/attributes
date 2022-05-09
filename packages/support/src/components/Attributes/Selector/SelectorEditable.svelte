<script lang="ts">
  import SelectorCustomAttribute from './SelectorAttribute.svelte';
  import SelectorCustomValue from './SelectorValueWrapper.svelte';
  import SelectorButton from './SelectorButton.svelte';
  import SelectorCustomAttributeValueText from './SelectorValue.svelte';
  import SelectorFields from './SelectorFields.svelte';
  import type { AttributeSettingValuePrimitive, AttributeSettingValueOptions } from '$global/types/schema';

  export let label: 'Name' | 'Value';

  export let option: string;
  export let isActive: boolean;
  export let onChange: (value: string) => void;

  export let valueType: AttributeSettingValueOptions | AttributeSettingValuePrimitive;
</script>

<SelectorCustomAttribute>
  {label}
</SelectorCustomAttribute>
<SelectorCustomValue>
  <SelectorCustomAttributeValueText>
    <SelectorFields {onChange} {isActive} id="selector" value={valueType} {option} />
  </SelectorCustomAttributeValueText>
  <SelectorButton selector={option} />
</SelectorCustomValue>
