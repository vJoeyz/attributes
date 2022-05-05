<script lang="ts">
  import StatusIcon from '@src/components/Layout/Icons/StatusIcon.svelte';

  export let message: string;
  export let status: boolean;
  export let type: string | undefined = undefined;
</script>

<div
  class="tool_message"
>
  <div
    class="tool_message-block"
    data-testid="attribute-error"
    data-error={type}
    class:is-success={status === true}
    class:is-error={status === false}
  >
    <StatusIcon status={status}/>
    <div>{@html message}</div>
  </div>
</div>

<style>
  .tool_message {
    padding: 0rem 1.5rem 1rem;
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
    border-radius: 0.375rem;
    color: #ccc;
    font-size: 1rem;
    letter-spacing: 0.025rem;
  }

  .tool_message-block.is-success {
    background-color: rgba(17, 17, 17, 0.3);
  }

  .tool_message-block.is-error {
    background-color: rgba(17, 17, 17, 0.3);
  }

  .tool_message-block :global(.icon-status) {
    height: 100%;
  }
</style>
