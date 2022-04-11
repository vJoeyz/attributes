<script lang="ts">
  import { clickOutside } from '@src/directives/clickOutside';

  export let forceClose: any;
</script>

<div use:clickOutside on:click_outside={forceClose}>
  <slot/>
</div>

<style>
  div {
    z-index: 99;
    background-color: #1a1a1a;
    display: block;
    position: absolute;
    min-width: 100%;
    box-sizing: border-box;
  }
</style>
