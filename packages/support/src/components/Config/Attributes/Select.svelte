<script lang="ts">
  import SelectDisplay from '@src/components/Layout/Form/SelectDisplay.svelte';
  import SelectOption from '@src/components/Layout/Form/SelectOption.svelte';
  import SelectDropdown from '@src/components/Layout/Form/SelectDropdown.svelte';
  import SelectSection from './SelectSection.svelte';
  import AttributeBadge from './AttributeBadge.svelte';
  import type { AttributeLoaded } from '@src/types/Schema.types';

  import {
    schemas,
    schemaSelected,
    schemaSettingsKey,
    schemaMode,
    SCHEMA_MODES,
  } from '@src/stores';

  let isOpen = false;
  let selectTitle: string | null = $schemaSelected && $schemaSelected.title || null;
  let onPageSchemas: AttributeLoaded[];
  let notOnPageSchemas: AttributeLoaded[];

  function toggleOptions() {
    if (!isOpen) {
      isOpen = !isOpen;
    }
  }

  function forceClose() {
    if (isOpen) {
      isOpen = false;
    }
  }

  function selectAttribute(value: string) {
    $schemaSettingsKey = value;
    forceClose();
    $schemaMode = SCHEMA_MODES.LOADING;
  }

  $: {
    selectTitle = $schemaSelected && $schemaSelected.title || null;
    onPageSchemas = $schemas.filter((schema: AttributeLoaded) => schema.loaded === true);
    notOnPageSchemas = $schemas.filter((schema: AttributeLoaded) => schema.loaded === false);
  }

</script>

<div
  class="tool_selector"
  data-testid="select-attributes"
>
  <SelectDisplay on:click={toggleOptions} isOpen={isOpen} size="large" testId="select-attribute-display">
    {#if selectTitle}
      {selectTitle}
    {:else}
      Select Attributes solution
    {/if}
  </SelectDisplay>

  {#if isOpen}
    <SelectDropdown on:click_outside={forceClose}>
      {#if onPageSchemas.length > 0}
        <SelectSection sectionTitle="Solutions found">
          {#each onPageSchemas as schema (schema.title)}
            {#if schema.loaded === true}
              <SelectOption
                isSelected={schema.title === selectTitle}
                on:click={() => selectAttribute(schema.key)}
                testId="select-attribute-option"
                size="large"
              >
                {schema.title} <AttributeBadge type="on-page"/>
              </SelectOption>
            {/if}
          {/each}
        </SelectSection>
      {/if}
      {#if notOnPageSchemas.length > 0}
        <SelectSection sectionTitle="All solutions">
          {#each notOnPageSchemas as schema (schema.title)}
            {#if schema.loaded === false}
              <SelectOption
                isSelected={schema.title === selectTitle}
                on:click={() => selectAttribute(schema.key)}
                testId="select-attribute-option"
                size="large"
              >
                {schema.title} <AttributeBadge type="not-on-page"/>
              </SelectOption>
            {/if}
          {/each}
        </SelectSection>
      {/if}
    </SelectDropdown>
  {/if}
</div>

<style>
  .tool_selector {
    z-index: 900;
    max-width: 100%;
    width: 100%;
    display: inline-block;
    position: relative;
    text-align: left;
    box-sizing: border-box;
    color: #ccc;
    margin-left: auto;
    margin-right: auto;
  }
</style>
