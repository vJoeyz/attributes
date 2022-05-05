<script lang="ts">
  import CheckButton from '@src/components/Layout/Buttons/Check.svelte';
  import ResetButton from '@src/components/Layout/Buttons/Reset.svelte';

  import { isDirty } from '@src/stores';
</script>

<div class="tool_buttons">
  {#if $isDirty}
    <ResetButton />
  {/if}
  <CheckButton />
</div>

<style>
  .tool_buttons {
    position: relative;
    z-index: 99;
    display: flex;
    padding: 1.15rem 1rem;
    flex-direction: row;
    align-items: flex-end;
    border-top: 1px solid #111;
    background-color: #252525;
    box-sizing: border-box;
  }
</style>
