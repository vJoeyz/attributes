<script lang="ts">
  import Checkmark from '@src/components/Layout/Icons/checkmark.svg';

  export let onCheck: ((event: Event) => void) | null;
  export let isRequired: boolean;
  export let isChecked: boolean;
  export let key: string;
  export let disabled = false;
</script>

<label class="checkbox-label">
  <div
    class="checkbox-mark"
    class:checked={isChecked}
    class:required={isRequired}
  >
    {#if isChecked}
      <Checkmark/>
    {/if}
</div>
  <input
    value={key}
    disabled={isRequired || disabled}
    class="checkbox-input"
    type="checkbox"
    on:click={(!isRequired && !disabled) && onCheck || undefined}
    bind:checked={isChecked}
  >
</label>

<style>
  .checkbox-input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }

  .checkbox-label {
    position: relative;
    left: 0%;
    top: 0%;
    right: auto;
    bottom: auto;
    z-index: 10;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-bottom: 0px;
    padding-left: 0px;
    display: block;
    font-weight: bold;
  }

  .checkbox-mark {
    position: relative;
    width: 2rem;
    height: 2rem;
    margin-top: 0px;
    margin-left: 0px;
    flex: 0 0 auto;
    border-width: 2px;
    border-color: #141414;
    border-radius: 0.375rem;
    cursor: pointer;
    border-top-style: solid;
    border-bottom-style: solid;
    border-left-style: solid;
    border-right-style: solid;
    float: left;
    margin-bottom: 0px;
    line-height: normal;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .checkbox-mark :global(svg) {
    width: 1rem;
  }

  .checkbox-mark.checked {
    border-color: #5c2aff;
    background-color: #5c2aff;
    background-size: 1rem;
    box-shadow: 0px 0px 3px 1px #3898ec;
  }

  .checkbox-mark.required {
    opacity: 0.6;
  }

</style>
