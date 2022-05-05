<script lang="ts">
  import ArrowToggle from '@src/components/Layout/Icons/ArrowToggle.svelte';
  export let onClick: (() => void) | null;
  export let isOpen: boolean;
</script>

<div
  class="tool_display"
  on:click={onClick}

  data-testid="select-attribute-display"
>
  <slot/>
  <div class="toggle">
    <ArrowToggle inverse={!isOpen}/>
  </div>
</div>

<style>
  .tool_display {
    text-align: left;
    display: flex;
    padding: 0.75rem 3rem 0.75rem 1rem;
    justify-content: space-between;
    border-style: solid;
    border-width: 1px;
    border-color: #000;
    background-color: #111;
    color: #ccc;
    user-select: none;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    text-decoration: none;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    white-space: nowrap;
  }

  .toggle {
    position: absolute;
    right: 0.75rem;
    top: 0.75rem;
  }

</style>
