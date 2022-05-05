<script lang="ts">
  import ToggleInstances from '@src/components/Config/Attributes/ToggleInstances.svelte';
  import Select from '@src/components/Config/Attributes/Select.svelte';

  export let isOpen: boolean;
</script>

<div class="tool_attributes">
  <Select/>
  <ToggleInstances on:toggle isOpen={isOpen}/>
</div>

<style>
  .tool_attributes {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    box-sizing: border-box;
  }

</style>
