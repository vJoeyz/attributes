<script lang="ts">
  import Attributes from './Attributes/ConfigAttributes.svelte';
  import Instances from './Instances/ConfigInstances.svelte';
  import Tabs from './Tabs/ConfigTabs.svelte';

  import { schemaUI } from '@src/stores';

  let isInstanceOpen = false;
  function toggleInstances() {
    isInstanceOpen = !isInstanceOpen;
  }
</script>

<div class="tool_config">
  <Attributes on:toggle={toggleInstances} isOpen={isInstanceOpen} />
  {#if isInstanceOpen && $schemaUI?.requiredInstance}
    <Instances />
    <Tabs />
  {/if}
</div>

<style>
  .tool_config {
    display: grid;
    padding: 1rem;
    grid-auto-columns: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 1rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    border-bottom: 1px solid #111;
  }
</style>
