<script lang="ts">
  import SelectorAttribute from './SelectorAttribute.svelte';
  import SelectorValueWrapper from './SelectorValueWrapper.svelte';
  import SelectorButton from './SelectorButton.svelte';
  import SelectorValue from './SelectorValue.svelte';

  export let label: 'Name' | 'Value';
  export let selector: string;
</script>

<SelectorAttribute>
  {label}
</SelectorAttribute>
<SelectorValueWrapper>
  <SelectorValue>
    {selector}
  </SelectorValue>
  <SelectorButton {selector} />
</SelectorValueWrapper>
