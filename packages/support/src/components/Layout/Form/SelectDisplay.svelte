<script lang="ts">
  import ArrowToggle from '@src/components/Layout/Icons/ArrowToggle.svelte';
  export let isOpen: boolean;

  export let size: 'medium' | 'large' = 'medium';
  export let testId: string | null = null;
  export let disabled = false;

</script>


<div
  class="select_display"
  class:medium={size === 'medium'}
  class:large={size === 'large'}
  class:disabled={disabled}
  data-testid={testId}
  on:click
>
  <slot/>
  <div
    class="select_toggle"
    class:medium={size === 'medium'}
    class:large={size === 'large'}
  >
    <ArrowToggle inverse={!isOpen}/>
  </div>
</div>

<style>
  .select_display {
    text-align: left;
    display: flex;
    justify-content: space-between;
    border-style: solid;
    border-width: 1px;
    user-select: none;
    cursor: pointer;
    position: relative;
    vertical-align: top;
    text-decoration: none;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    white-space: nowrap;
    font-size: 1rem;
  }

  .select_display.medium {
    padding: 0.5rem 3rem 0.5rem 1rem;
    border-color: #000;
    background-color: #1a1a1a;
    color: #979797;
  }

  .select_display.large {
    padding: 0.75rem 3rem 0.75rem 1rem;
    border-color: #000;
    background-color: #111;
    color: #ccc;
  }

  .select_toggle {
    position: absolute;
  }

  .select_toggle.medium {
    right: 0.5rem;
    top: 0.5rem;
  }

  .select_toggle.large {
    right: 0.75rem;
    top: 0.75rem;
  }


  .select_display.disabled {
    opacity: 0.4;
  }

</style>
