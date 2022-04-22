<script lang="ts">
  import ArrowToggle from '@src/components/Layout/Icons/ArrowToggle.svelte';

  export let toggleDropdown: () => void;
  export let isOpen = false;
</script>

<div class="tool_select-display" on:click={toggleDropdown} class:open={isOpen} data-testid="field-specialization">
  <slot/>

  <div class="toggle">
    <ArrowToggle inverse={!isOpen}/>
  </div>
</div>

<style>
  .tool_select-display {
    display: flex;
    width: 100%;
    padding: 0.5rem 3rem 0.5rem 1rem;
    justify-content: space-between;
    border-style: solid;
    border-width: 1px;
    border-color: #000;
    border-radius: 0.375rem;
    background-color: #1a1a1a;
    color: #979797;
    font-size: 1rem;
    user-select: none;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    text-decoration: none;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    white-space: nowrap;
    box-sizing: border-box;
    position: relative;
  }


  .toggle {
    position: absolute;
    right: 0.75rem;
    top: 0.5rem;
  }
</style>
