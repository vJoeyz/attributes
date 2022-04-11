<script lang="ts">
  export let onSelect: any;
  export let selected: boolean;
</script>

<div class="select_option" on:click={onSelect} class:current={selected} data-testid="field-specialization-option">
  <slot/>
</div>

<style>
  .select_option {
    display: flex;
    width: 100%;
    max-width: 100%;
    padding: 0.5rem 1rem;
    align-items: center;
    color: #ccc;
    font-size: 1rem;
    text-decoration: none;
    position: relative;
    vertical-align: top;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    white-space: nowrap;
    cursor: pointer;
  }


  .select_option.current {
    color: #bcfd2e;
  }
</style>
