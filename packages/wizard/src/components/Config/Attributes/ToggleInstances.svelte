<script lang="ts">
  import {
    schemaSelected,
    schemaInstances,
  } from '@src/stores';

  import Add from '@src/components/Layout/Icons/instances-add.svg';


  export let toggleInstances: () => void;
  export let isOpen: boolean;

  let disabled: boolean = $schemaSelected === null;

  if ($schemaInstances > 1) {
    toggleInstances();
  }

  $: {
    disabled = $schemaSelected === null;
  }

</script>

<button
  data-testid="select-attribute-toggle-instances"
  class="tool_toggle-instance"
  on:click={!disabled && toggleInstances || null}
  class:open={isOpen}
>
  <Add/>
</button>

<style>
  .tool_toggle-instance {
    display: flex;
    width: 4rem;
    height: 100%;
    margin-left: 1rem;
    justify-content: center;
    align-items: center;
    border-style: solid;
    border-width: 1px;
    border-color: #000;
    background-color: #111;
    box-sizing: border-box;
    cursor: pointer;
  }

  .tool_toggle-instance:hover {
    background-color: #1a1a1a;
  }

  .tool_toggle-instance :global(svg) {
    width: 0.8rem;
    height: 0.8rem;
    opacity: 0.67;
    transform: translate3d(0px, 0px, 0px)
      scale3d(1, 1, 1)
      rotateX(0deg)
      rotateY(0deg)
      rotateZ(0deg)
      skew(0deg, 0deg);
    transform-style: preserve-3d;
  }

  .tool_toggle-instance.open :global(svg) {
    transform: translate3d(0px, 0px, 0px)
      scale3d(1, 1, 1)
      rotateX(0deg)
      rotateY(0deg)
      rotateZ(45deg)
      skew(0deg, 0deg);
    transform-style: preserve-3d;
  }
</style>
