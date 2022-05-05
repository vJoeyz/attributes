<script lang="ts">
  import SelectorCustomAttribute from './SelectorCustomAttribute.svelte';
  import SelectorCustomValue from './SelectorCustomValue.svelte';
  import SelectorButton from './SelectorButton.svelte';
  import SelectorCustomAttributeValueText from './SelectorCustomValueText.svelte';

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
