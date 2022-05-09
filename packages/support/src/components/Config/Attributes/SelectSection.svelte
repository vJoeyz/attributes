<script lang="ts">
  export let sectionTitle: string;
</script>

<div class="tool_select-sections">
  <div class="tool_select-sections-title">{sectionTitle}</div>
  <slot />
</div>

<style>
  .tool_select-sections {
    padding-bottom: 1rem;
    box-sizing: border-box;
  }

  .tool_select-sections-title {
    padding: 0.5rem 1rem;
    background-color: #111;
  }
</style>
