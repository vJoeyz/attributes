<script lang="ts">

  import Arrow from '@src/components/Layout/Icons/arrow-right.svg';
  export let inverse = false;

</script>


  <span class="right-arrow-icon" class:inverse={inverse}>
    <Arrow/>
  </span>


<style>

  .right-arrow-icon {
    width: 1rem;
    opacity: 0.6;
  }

  .right-arrow-icon > :global(svg) {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
    transform-style: preserve-3d;
    width: 1rem;
    transition: all 1s ease-in-out;
  }

  .right-arrow-icon.inverse > :global(svg) {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(180deg) skew(0deg, 0deg);
    transform-style: preserve-3d;
    transition: all 1s ease-in-out;
  }

</style>
