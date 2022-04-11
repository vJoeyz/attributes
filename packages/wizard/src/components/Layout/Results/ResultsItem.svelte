<script lang="ts">
  import StatusIcon from '@src/components/Layout/Icons/StatusIcon.svelte';
  import ArrowIcon from '@src/components/Layout/Icons/ArrowDown.svelte';
  import AttributeKey from '@src/components/Layout/AttributeKey.svelte';

  export let message: string;
  export let key: string;
  export let id: string;

  function scrollToAttribute() {
    const attributeElement = document.querySelector(`#${id}`);
    if (attributeElement) {
      attributeElement.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }

</script>

<div class="tool_results-item" on:click={scrollToAttribute}>
  <StatusIcon status={false}/>
  <div class="tool_results-item-block">
    <AttributeKey>
      {key}
    </AttributeKey>
    {@html message}
  </div>
  <ArrowIcon/>
</div>

<style>
  .tool_results-item {
    grid-column-start: span 1;
    grid-column-end: span 1;
    grid-row-start: span 1;
    grid-row-end: span 1;
    display: grid;
    justify-content: start;
    justify-items: start;
    align-items: center;
    align-content: center;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto;
    text-decoration: none;
    max-width: 100%;
    cursor: pointer;
  }

  .tool_results-item-block {
    grid-column-start: span 1;
    grid-column-end: span 1;
    grid-row-start: span 1;
    grid-row-end: span 1;
  }

  .tool_results-item-block :global(.validator-highlight) {
    font-weight: 700;
  }

  .tool_results-item-block :global(.validator-label) {
    font-weight: 700;
  }

  .tool_results-item-block :global(.validator-attribute) {
    display: inline-block;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    border-radius: 0.5rem;
    background-color: #444;
    color: #e7e7e7;
    font-size: 0.875rem;
    box-sizing: border-box;
  }
</style>
