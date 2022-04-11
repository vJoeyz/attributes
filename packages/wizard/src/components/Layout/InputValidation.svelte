<script lang="ts">
  import StatusIcon from '@src/components/Layout/Icons/StatusIcon.svelte';

  export let message: string;
  export let status: boolean;
  export let type: string | undefined = undefined;
</script>

<div class="tool_message">
  <div class="tool_message-block" data-testid="attribute-error" data-error={type}>
    <StatusIcon status={status}/>
    <div>{@html message}</div>
  </div>
</div>

<style>
  .tool_message {
    padding: 0rem 2rem 2rem;
    background-color: #252525;
  }

  .tool_message  :global(svg) {
    width: 1.5rem;
    max-width: 100%;
    height: 1.5rem;
    max-height: 100%;
    margin-right: 0.5rem;
  }

  .tool_message-block {
    display: flex;
    padding: 0.5rem;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    border-radius: 0.375rem;
    background-color: #1a1a1a;
    color: #ccc;
    font-size: 0.875rem;
    letter-spacing: 0.025rem;
  }

  .tool_message-block :global(.validator-highlight) {
    font-weight: 700;
  }

  .tool_message-block :global(.validator-label) {
    font-weight: 700;
  }

  .tool_message-block :global(.validator-attribute) {
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
