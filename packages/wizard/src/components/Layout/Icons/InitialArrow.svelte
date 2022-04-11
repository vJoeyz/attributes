<script lang="ts">
  import InitialArrow from '@src/components/Layout/Icons/initial-arrow.svg';


</script>


<span>
  <InitialArrow/>
</span>

<style>
  span {
    position: absolute;
    left: 0%;
    top: 0%;
    right: auto;
    bottom: auto;
    width: 1.5rem;
    margin-top: -1.2rem;
    margin-right: 1rem;
    margin-left: 1.5rem;

  }

  span > :global(svg) {
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    width: 1.5rem;
  }
</style>
