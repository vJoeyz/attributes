<script lang="ts">
  import SelectDisplay from '@src/components/Field/Specialization/Form/Select/SelectDisplay.svelte';
  import SelectDropdown from '@src/components/Field/Specialization/Form/Select/SelectDropdown.svelte';
  import SelectOption from '@src/components/Field/Specialization/Form/Select/SelectOption.svelte';

  export let options: any[];
  // export let onSelect: any;
  export let fieldIndex: any;
  export let changeFieldElement: any;

  let isOpen: boolean = false;

  function toggleOptions() {
    isOpen = !isOpen;
  }

  function forceClose() {
    if (isOpen) {
      isOpen = false;
    }
  }

  function onSelect(element: string) {
    return function() {
      changeFieldElement(fieldIndex.index, element);
      forceClose();
    }
  }

  let specialization = fieldIndex.specialization || 'Select an option';

  $: {
    specialization = fieldIndex.specialization || 'Select an option';
  }

</script>

<div>

  <SelectDisplay toggleDropdown={toggleOptions} isOpen={isOpen}>{specialization}</SelectDisplay>
  {#if isOpen}
  <SelectDropdown forceClose={forceClose}>
    {#each options as option (option.key)}
    <SelectOption onSelect={onSelect(option.key)} selected={specialization === option.key}>{option.key}</SelectOption>
    <!-- <SelectOption>Option 2</SelectOption>
    <SelectOption>Option 3</SelectOption> -->
    {/each}
  </SelectDropdown>
  {/if}

</div>

<style>
  div {
    z-index: 99;
    width: 100%;
    margin-left: 1rem;
    display: inline-block;
    position: relative;
    text-align: left;
    margin-right: auto;
    box-sizing: border-box;
  }
</style>
