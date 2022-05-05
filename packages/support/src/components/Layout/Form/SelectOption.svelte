<script lang="ts">
  export let isSelected: boolean;
  export let testId: string | null = null;

  export let size: 'medium' | 'large' = 'medium';
</script>


<div
  class="select_option"
  class:medium={size === 'medium'}
  class:large={size === 'large'}
  tabindex="-1"
  role="option"
  aria-selected="false"
  class:current={isSelected}
  on:click
  data-testid={testId}
>
  <slot/>
</div>

<style>

  .select_option {
    display: flex;
    max-width: 100%;
    align-items: center;
    border-bottom: 1px solid #000;
    background-color: #1a1a1a;
    color: #ccc;
    background-attachment: scroll !important;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    text-align: left;
    white-space: nowrap;
  }

  .select_option.medium {
    padding: 0.5rem 1rem;
  }

  .select_option.large {
    padding: 0.75rem 1rem;
  }

  .select_option.current {
    color: #bcfd2e;
    border-style: solid;
    border-width: 1px;
    border-color: #bcfd2e;
  }
</style>
