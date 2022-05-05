<script lang="ts">
  export let selectOption: () => void;
  export let isSelected: boolean;

</script>

<div
  class="tool_select_option"
  tabindex="-1"
  role="option"
  aria-selected="false"
  class:current={isSelected}
  on:click={selectOption}
  data-testid="settings-select-option"
>
  <slot/>
</div>

<style>

  .tool_select_option {
    background-attachment: scroll !important;
    display: flex;
    max-width: 100%;
    padding: 0.75rem 1rem;
    align-items: center;
    border-bottom: 1px solid #000;
    background-color: #1a1a1a;
    color: #ccc;
    font-size: 1rem;
    text-decoration: none;
    cursor: pointer;

  }

  .tool_select_option.current {
    color: #bcfd2e;
    border-style: solid;
    border-width: 1px;
    border-color: #bcfd2e;
  }
</style>
