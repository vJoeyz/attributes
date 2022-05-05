<script lang="ts">
	import { clickOutside } from '@src/directives/clickOutside';
  export let forceClose: () => void | undefined;

</script>

<div class="tool_select-dropdown" use:clickOutside on:click_outside={forceClose}>
  <slot/>
</div>

<style>
  .tool_select-dropdown {
    z-index: 99;
    background-color: #1a1a1a;
    display: inline-block;
    position: absolute;
    min-width: 100%;
    box-sizing: border-box;
    text-align: left;
    max-height: 60vh;
    overflow-y: scroll;
  }


  .tool_select-dropdown::-webkit-scrollbar {
    width: 0.5rem;
  }

  .tool_select-dropdown::-webkit-scrollbar-track {
    background:rgb(0, 0, 0);
  }
  .tool_select-dropdown::-webkit-scrollbar-thumb {
    background: #474747;
  }
</style>
