<script lang="ts">
  export let id: string;
  export let disabled: boolean = false;
  export let checked: boolean = false;

  import {
    isSubmitted
  } from '@src/stores';
</script>

<div
  id={id}
  class="tool_item"
  class:disabled={disabled}
  class:unchecked={$isSubmitted && !checked}
>

  <slot/>
</div>

<style>
  .tool_item {
    position: relative;
  }


  .tool_item.unchecked {
    opacity: 0.5;
  }

  .tool_item.disabled {
    opacity: 0.1;
  }
</style>
