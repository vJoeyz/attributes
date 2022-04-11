<script lang="ts">
  import ElementSpecialization from './ElementSpecialization.svelte';
  import IdentifierSpecialization from './IdentifierSpecialization.svelte';

  export let specializations: any;
  export let changeFieldIdentifier: any;
  export let changeFieldElement: any;
  export let fieldIndex: any;
  export let identifier: string;
</script>

<div class="tool_field-wrapper">
  <div class="tool_field-row">
    <IdentifierSpecialization
      identifier={identifier}
      fieldIndex={fieldIndex}
      changeFieldIdentifier={changeFieldIdentifier}
    />
  </div>
  {#if specializations.length > 1}
    <div class="tool_field-row">
      <ElementSpecialization
        specializations={specializations}
        fieldIndex={fieldIndex}
        changeFieldElement={changeFieldElement}
      />
    </div>
  {/if}
</div>

<style>
  .tool_field-wrapper {
    position: relative;
    z-index: 99;
    display: grid;
    margin: 0.5rem 2rem 1rem 2.5rem;
    padding: 0rem 2rem;
    grid-auto-columns: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    border-left: 1px solid #111;
    box-sizing: border-box;
  }

  .tool_field-row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    transform: translate(0px, 0px);
    box-sizing: border-box;
  }


</style>
