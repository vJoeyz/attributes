<script lang="ts">
  import ExternalLink from '@src/components/Layout/Icons/external-link.svg';
</script>

<a href="#" class="tool_tutorial-link">
  <div>Watch tutorial</div>
  <ExternalLink/>
</a>

<style>
  .tool_tutorial-link {
    display: grid;
    align-items: center;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: auto;
    grid-template-rows: auto;
    color: #979797;
    font-size: 0.875rem;
    font-weight: 600;
    text-decoration: none;
    max-width: 100%;
  }

  .tool_tutorial-link :global(svg) {
    width: 0.75rem;
  }
</style>
