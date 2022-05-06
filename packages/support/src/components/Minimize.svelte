<script lang="ts">
  import ArrowRight from '@src/components/Layout/Icons/ArrowRight.svelte';

  export let toggleMinimize: () => void;
  export let isMinimized = false;
</script>

<div class="tool_minimize" on:click={toggleMinimize}>
  <ArrowRight inverse={isMinimized} />
</div>

<style>
  .tool_minimize {
    position: absolute;
    left: -3em;
    top: 0;

    z-index: 9999;
    display: flex;
    width: 3rem;
    height: 3.5rem;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: #252525;
    box-sizing: border-box;
    cursor: pointer;
  }
</style>
