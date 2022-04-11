<script lang="ts">
  export let changeFieldIdentifier: any;
  export let fieldIndex: any;
  export let identifier: string | null;

  let currentValue: string;

  if (identifier) {
    currentValue = identifier;
  }
  // = identifier;

  function onInput(event: any) {
    const value = event.target.value;
    changeFieldIdentifier(fieldIndex.index, value);
    currentValue = value;
  }

  $: {

    if (identifier === '') {
      currentValue = '';
    }
  }

</script>

<div>Field</div>
<input
  data-testid="field-identifier"
  type="text"
  class="field_input"
  maxlength="256"
  placeholder="Identifier name"
  value={currentValue}
  on:input={onInput}
>

<style>
    .field_input {
    min-height: 2.5rem;
    margin-bottom: 0rem;
    margin-left: 1rem;
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    border-style: solid;
    border-width: 1px;
    border-color: #000;
    border-radius: 0.375rem;
    background-color: #1a1a1a;
    color: #bcfd2e;
    font-size: 1rem;
    display: block;
    width: 100%;
    height: 38px;
    padding: 8px 12px;
    line-height: 1.42857143;
    box-sizing: border-box;
  }

  .field_input::placeholder {
    color: #979797;
  }

  .field_input:focus {
    border-color: #bcfd2e;
    box-shadow: 0 0 0 0 transparent;
    outline: none;
  }

  .field_input:focus-visible {
    border-color: #bcfd2e;
    box-shadow: 0 0 0 0 transparent;
    outline: none;
  }
</style>
