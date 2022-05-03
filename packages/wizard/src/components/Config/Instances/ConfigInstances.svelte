<script lang="ts">
  import ArrowUp from '@src/components/Layout/Icons/arrow-green-up.svg';
  import ArrowDown from '@src/components/Layout/Icons/arrow-green-down.svg';
  import { schemaInstances, schemaSelected, schemaSettingsInstance } from '@src/stores'

  let value = $schemaInstances;
  let isEnableUp: boolean;
  let isEnableDown: boolean;

  checkIsEnableUp();
  checkIsEnableDown();

  function checkZero() {
    if (value === 0) {
      value = 1;
    }
  }

  function checkIsEnableUp() {
    if (value === 20) {
      isEnableUp = false;
      return;
    }

    isEnableUp = true;
  }

  function checkIsEnableDown() {
    if (value === 1) {
      isEnableDown = false;
      return;
    }

    isEnableDown = true;
  }

  function valueUp() {
    if (isEnableUp) {
      value = value + 1;
    }

    checkIsEnableUp();
    checkIsEnableDown();
  }

  function valueDown() {

    if (isEnableDown) {
      value = value - 1;
    }

    checkIsEnableUp();
    checkIsEnableDown();
  }

  $: {

    value = value !== 0 && parseInt(value.toString().replace(/\D/g, '')) || 0;

    if (value < 0 || value === null) {
      value = 1;
    }
    if (value > 20) {
      value = 20;
    }

    checkIsEnableUp();
    checkIsEnableDown();

    $schemaInstances = value;
    if ($schemaSettingsInstance > value) {
      $schemaSettingsInstance = value;
    }


  }
</script>

<div class="tool_instances">
  <div class="tool_question">
    {#if $schemaSelected}
      How many instances of {$schemaSelected && $schemaSelected.title}?
    {:else}
      Loading solution
    {/if}
  </div>
  <div class="number_input-wrapper">
    <input
      type="text"
      class="number_input-field"
      maxlength="256"
      name="instances"
      data-name="instances"
      placeholder="1"
      bind:value={value}
      id="instances"
      min={1}
      max={20}
      on:blur={checkZero}
      data-testid="select-attribute-input-instances"
    >
    <div class="number_input-block">
      <div
        class="number_input-arrow"
        on:click={valueUp}
        class:disabled={!isEnableUp}
        data-testid="select-attribute-more-instances"
      >
        <ArrowUp/>
      </div>
      <div class="number_input-divider"></div>
      <div
        class="number_input-arrow"
        on:click={valueDown}
        class:disabled={!isEnableDown}
        data-testid="select-attribute-minus-instances"
      >
        <ArrowDown/>
      </div>
    </div>
  </div>
</div>

<style>

  .tool_question {
    margin-left: 0.5rem;
    align-self: center;
  }

  .tool_instances {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: stretch;
  }

  .number_input-field {
    min-height: 100%;
    margin-bottom: 0px;
    padding: 0.5rem 1rem;
    border: 1px none #000;
    background-color: #111;
    color: #bcfd2e;
    display: block;
    width: 100%;
    height: 38px;
    font-size: 14px;
    line-height: 1.42857143;
    margin: 0;
    box-sizing: border-box;
  }

  .number_input-field::placeholder {
    color: #979797;
  }

  .number_input-wrapper {
    position: relative;
    max-width: 6rem;
    min-height: 2rem;
    margin-left: 2rem;
    max-height: 2.375rem;
  }

  .number_input-block {
    position: absolute;
    left: auto;
    top: 0%;
    right: 0%;
    bottom: 0%;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    border-left: 1px solid #000;
    border-top-right-radius: 0.375rem;
    border-bottom-right-radius: 0.375rem;
    background-color: #1a1a1a;
    color: #111;

  }

  .number_input-arrow {
    display: flex;
    padding-right: 0.5rem;
    padding-left: 0.5rem;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex: 1;
    cursor: pointer;
  }

  .number_input-arrow.disabled {
    opacity: 0.2;
  }

  .number_input-divider {
    width: 100%;
    height: 1px;
    background-color: #000;
  }

  .number_input-arrow :global(svg) {
    width: 0.665rem;
  }
</style>
