<script lang="ts">

  import WarningIcon from '@src/components/Layout/Icons/warning-icon.svg';
  import CorrectIcon from '@src/components/Layout/Icons/correct-icon.svg';

  export let status: boolean;
</script>


<span>
  {#if status}
    <CorrectIcon/>
  {:else}
    <WarningIcon/>
  {/if}
</span>

<style>
  span {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }

  span :global(svg) {
    width: 1.5rem;
    max-width: 100%;
    min-width: 1.5rem;
    height: 1.5rem;
    max-height: 100%;
  }
</style>
