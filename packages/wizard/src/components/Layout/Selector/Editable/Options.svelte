<script lang="ts">
  import OptionsDisplay from './Options/OptionsDisplay.svelte';
  import OptionsDropdown from './Options/OptionsDropdown.svelte';
  import OptionsOptions from './Options/OptionsOptions.svelte';
  import type { AttributeSettingValueOptions } from '@global/types/schema';

  // import SolutionIcon from '@src/components/Layout/Icons/tips-icon.svg';

  export let value: AttributeSettingValueOptions;
  export let attributeValue: string | undefined;

  export let isActive: boolean;
  export let onChange: (value: string) => void;

  let isOpen = false;
  let selected = value.default;

  // let selectedDescription: string;

  function toggleOptions() {
    if (isActive) {
      isOpen = !isOpen;
    }
  }

  function forceClose() {
    if (isOpen) {
      isOpen = false;
    }
  }

  function selectAttribute(value: string) {
    console.log(value);
    onChange(value);
    forceClose();
  }

  $: {
    attributeValue = attributeValue || selected;

    // if (selected) {
    //   let selectedItem = value.options.find((option) => option.value === selected);
    //   if (selectedItem) {
    //     selectedDescription = selectedItem.description;
    //   }
    // }
  }
</script>

<OptionsDisplay isOpen={isOpen} onClick={toggleOptions} isActive={isActive}>
  {#if attributeValue}
    {attributeValue}
  {:else}
    Select value
  {/if}
</OptionsDisplay>

{#if isOpen}
<OptionsDropdown forceClose={forceClose}>
  {#each value.options as option}
    <OptionsOptions
      isSelected={attributeValue === option.value}
      selectOption={() => selectAttribute(option.value)}
    >
      {option.value}
    </OptionsOptions>
  {/each}
</OptionsDropdown>
{/if}
