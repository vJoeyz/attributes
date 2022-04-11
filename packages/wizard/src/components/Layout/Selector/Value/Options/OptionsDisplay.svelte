<script lang="ts">
  import ArrowToggle from '@src/components/Layout/Icons/ArrowToggle.svelte';

  export let onClick: any;
  export let isOpen: boolean;
  export let isActive: boolean;
</script>


<div
  class="options_display"
  on:click={onClick}
  class:open={isOpen}
  class:disabled={!isActive}
  data-testid="settings-select"
>
  <slot/>
  <div class="toggle">
    <ArrowToggle inverse={!isOpen}/>
  </div>
</div>

<style>
  .options_display {
    display: flex;
    width: 100%;
    max-width: 100%;
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
  }



  .options_display.disabled {
    opacity: 0.4;
  }


  .toggle {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
  }
</style>
