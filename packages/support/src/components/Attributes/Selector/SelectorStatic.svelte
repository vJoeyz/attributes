<script lang="ts">
  import SelectorCustomAttribute from './SelectorAttribute.svelte';
  import SelectorCustomValue from './SelectorValueWrapper.svelte';
  import SelectorButton from './SelectorButton.svelte';
  import SelectorCustomAttributeValueText from './SelectorValue.svelte';

  export let label: 'Name' | 'Value';
  export let selector: string;
</script>

<SelectorCustomAttribute>
  {label}
</SelectorCustomAttribute>
<SelectorCustomValue>
  <SelectorCustomAttributeValueText>
    {selector}
  </SelectorCustomAttributeValueText>
  <SelectorButton {selector} />
</SelectorCustomValue>
