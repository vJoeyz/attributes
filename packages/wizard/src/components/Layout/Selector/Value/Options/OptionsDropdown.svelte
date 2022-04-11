<script lang="ts">
  import { clickOutside } from '@src/directives/clickOutside';
  export let forceClose: any | undefined;
</script>

<div class="options-dropdown" use:clickOutside on:click_outside={forceClose}>

  <slot/>
</div>

<style>
  .options-dropdown {
    z-index: 99;
    background-color: #1a1a1a;
    display: block;
    position: absolute;
    min-width: 100%;
    text-align: left;
    margin-left: auto;
    max-width: 100%;
    width: 100%;
  }
</style>
