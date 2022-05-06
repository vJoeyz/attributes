<script lang="ts">
  import ArrowToggle from '@src/components/Layout/Icons/ArrowToggle.svelte';
  export let toggleSelector: (() => void) | null;
  export let isOpen: boolean;
</script>

<div class="attribute_toggle" on:click={toggleSelector} data-testid="attribute-toggle">
  <ArrowToggle inverse={!isOpen} />
</div>

<style>
  .attribute_toggle {
    cursor: pointer;
  }
</style>
