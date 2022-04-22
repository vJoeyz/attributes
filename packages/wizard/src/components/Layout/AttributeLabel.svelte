<script lang="ts">
  export let toggleSelector: (() => void) | null;
</script>
<div class="attribute_label" on:click={toggleSelector}>
  <slot/>
</div>

<style>
  .attribute_label {
    min-height: 2rem;
    flex-direction: row;
    justify-content: flex-start;
    flex-wrap: wrap;
    align-items: center;
    box-sizing: border-box;
    flex-grow: 1;
    cursor: pointer;
  }
</style>
