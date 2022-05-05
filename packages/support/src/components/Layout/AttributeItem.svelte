<script lang="ts">
  export let id: string;
  export let disabled = false;
  export let checked = false;
  export let status: boolean | null;

  import { isSubmitted } from '@src/stores';
</script>

<div
  {id}
  class="tool_item"
  class:disabled
  class:unchecked={$isSubmitted && !checked}
  class:is-success={status === true}
  class:is-error={status === false}
>
  <slot />
</div>

<style>
  .tool_item {
    position: relative;
    border-bottom: 1px solid #000;
  }

  .tool_item.unchecked {
    opacity: 0.5;
  }

  .tool_item.disabled {
    opacity: 0.1;
  }

  .tool_item.is-success {
    background-color: #222b22;
  }

  .tool_item.is-error {
    background-color: rgba(238, 64, 76, 0.1);
  }
</style>
