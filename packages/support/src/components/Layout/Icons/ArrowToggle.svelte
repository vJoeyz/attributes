<script lang="ts">
  import Arrow from '@src/components/Layout/Icons/arrow-toggle.svg';
  export let inverse: boolean;
</script>

<span class:inverse={!inverse}>
  <Arrow />
</span>

<style>
  span :global(svg) {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg);
    transform-style: preserve-3d;
    position: relative;
    display: flex;
    min-width: 2rem;
    height: 1.5rem;
    margin: 0rem 0rem 0rem auto;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    top: 0;
    right: 0;
    bottom: 0;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    -webkit-font-smoothing: antialiased;
  }

  span.inverse :global(svg) {
    transform: translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(180deg) skew(0deg, 0deg);
  }
</style>
