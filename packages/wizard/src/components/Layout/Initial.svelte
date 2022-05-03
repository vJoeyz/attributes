<script lang="ts">
  import InitialArrow from '@src/components/Layout/Icons/InitialArrow.svelte';
  import ExternalLink from '@src/components/Layout/Icons/ExternalLink.svelte';
</script>

<div class="tool_initial-wrapper">
  <div class="tool_initial-block">
    <InitialArrow/>
    <p class="tool_initial-block-text">Select the Attribute solution you would like to check if it is working properly.<br></p>
    <a href="https://www.finsweet.com/attributes/directory" target="_blank"
      class="tool_initial-link">
      <ExternalLink/>
      <div>Go to our directory</div>
    </a>
  </div>
</div>


<style>
  .tool_initial-wrapper {
    display: flex;
    padding: 2rem 1rem 1.5rem;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .tool_initial-block {
    position: relative;
    display: grid;
    width: 100%;
    padding: 3rem;
    grid-auto-columns: 1fr;
    grid-column-gap: 1.5rem;
    grid-row-gap: 1.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    border-style: solid;
    border-width: 1px;
    border-color: #111;
    background-color: #1a1a1a;
    box-sizing: border-box;
  }

  .tool_initial-block-text {
    color: #bcfd2e;
    margin-top: 0;
    margin-bottom: 10px;
    box-sizing: border-box;
  }

  .tool_initial-link {
    display: grid;
    justify-content: start;
    justify-items: start;
    align-items: center;
    grid-auto-flow: column;
    grid-auto-columns: auto;
    grid-column-gap: 1rem;
    grid-row-gap: 1rem;
    grid-template-columns: auto;
    grid-template-rows: auto;
    color: #a8a8a8;
    cursor: pointer;
    text-decoration: underline;
  }
</style>
