<script lang="ts">
  export let isLoading: boolean = false;
</script>

<div class="tool_loading" class:show={isLoading}>
  <div class="lds-ring">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</div>


<style>

  .tool_loading {
    display: flex;
    visibility: hidden;
    position: absolute;
    z-index: 950;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: #000;
    opacity: 0;
    transform: opacity 3s ease-out;
  }

  .tool_loading.show {
    visibility: visible;
    opacity: 0.8;
    transform: opacity 3s ease-out;
  }

  .lds-ring {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ring div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 64px;
    height: 64px;
    margin: 8px;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
  }
  .lds-ring div:nth-child(1) {
    animation-delay: -0.45s;
  }
  .lds-ring div:nth-child(2) {
    animation-delay: -0.3s;
  }
  .lds-ring div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
