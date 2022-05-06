<script lang="ts">
  import { schemaInstances, schemaSettingsInstance } from '@src/stores';

  function selectInstance(value: number) {
    $schemaSettingsInstance = value;
  }
</script>

<div class="tool_tabs">
  <div class="tool_tab-block">
    {#each Array.from(Array($schemaInstances).keys()) as panelInstance}
      <div
        class="tool_tab"
        class:selected={panelInstance + 1 === $schemaSettingsInstance}
        on:click={() => selectInstance(panelInstance + 1)}
        data-testid="select-attribute-instance"
      >
        {panelInstance + 1}
      </div>
    {/each}
  </div>
</div>

<style>
  .tool_tabs {
    display: grid;
    padding-top: 1rem;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-end;
    grid-auto-columns: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    border-top: 1px solid #111;
  }

  .tool_tab-block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: stretch;
    flex: 1;
    max-width: 100%;
    flex-wrap: wrap;
  }

  .tool_tab {
    margin-right: -1px;
    margin-bottom: -1px;
    margin-left: -1px;
    padding: 0.5rem;
    border-style: solid;
    border-width: 1px;
    border-color: #111;
    background-color: #333;
    color: #979797;
    text-align: center;
    cursor: pointer;
    box-sizing: border-box;
    /* flex: 0 0 3.5rem; */
    flex: 1 0 3.5rem;
  }

  .tool_tab.selected {
    background-color: #1a1a1a;
    color: #bcfd2e;
  }
</style>
