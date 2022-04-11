<script lang="ts">
  import { onMount } from 'svelte';
  import ExternalLink from '@src/components/Layout/Icons/external-link.svg';
  import Selector from './Selector/Selector.svelte';
  import CustomizableSelector from './Selector/CustomizableSelector.svelte';
  import {
    createHighlight,
    enableHighlight,
    disableHighlight,
  } from '@src/services/Highlight/HighlightService';
  import type { AttributeValue } from '@src/global/types/schema';
  import type { Highlight } from '@src/types/Highlight.types';
  import type { SchemaInputType } from '@src/types/Input.types';
  import {
    schemaSettingsKey,
    schemaSettingsInstance,
    schemaSettingsStandalone,
    schemaSelected,
    schemaData,
  } from '@src/stores';

  export let name: string;
  export let value: string = '';
  export let type: SchemaInputType;
  export let isActive: boolean | undefined = undefined;
  export let onChange: any | undefined = undefined;
  export let specialization: string | undefined = undefined;

  export let valueType: AttributeValue | undefined = undefined;
  export let forceStatic = false;

  let selectorName: string;
  let selectorValue: string;
  let highlight: Highlight;

  let docs: string = $schemaSelected && `${$schemaSelected.href}#${name}` || '';


  onMount(async () => {
    const schemaSettings = {
      key: $schemaSettingsKey || '',
      standalone: $schemaSettingsStandalone,
      instance: $schemaSettingsInstance,
    };

    if ($schemaData) {
      highlight = createHighlight(name, type, specialization || null, $schemaData, schemaSettings);
    }
  });

  function createSelector(instances: number) {

    switch (type) {
      case 'element':
      case 'field':

        selectorName = `fs-${$schemaSettingsKey}-element`;
        selectorValue = instances > 1 && `${name}-${instances}` || name;

        break;
      case 'elementSetting':
      case 'fieldSetting':
        selectorName = `fs-${$schemaSettingsKey}-${name}`;

        break;

      default:
        throw new Error('Selector: Missing type');
    }

  }

  function onMouseEnter() {
    enableHighlight(highlight)
  }

  function onMouseLeave() {
    if (highlight) {
      disableHighlight(highlight)
    }
  }

  createSelector($schemaSettingsInstance);

  $: {
    createSelector($schemaSettingsInstance);
  }

  $: if (specialization) {
    const schemaSettings = {
      key: $schemaSettingsKey || '',
      standalone: $schemaSettingsStandalone,
      instance: $schemaSettingsInstance,
    };

    if ($schemaData) {
      highlight = createHighlight(name, type, specialization, $schemaData, schemaSettings);
    }
  }


</script>

<div
  class="attribute-selector-container"
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>

  <div class="attribute-selector-interface" >
    <div class="attribute-selector-block">
      <Selector label="Name" selector={selectorName}/>
    </div>
    <div class="attribute-selector-block">
      {#if (type === 'fieldSetting' || type === 'elementSetting') && !forceStatic
        && valueType !== undefined && valueType.type !== 'boolean'
        && isActive !== undefined
        && onChange !== undefined}
        <CustomizableSelector
          valueType={valueType}
          onChange={onChange}
          label="Value"
          isActive={isActive}
          option={value}
        />
      {:else}
        <Selector label="Value" selector={!valueType && selectorValue || value || 'true'}/>
      {/if}
    </div>
    <a class="attribute-selector-docs" target="_blank" href={docs}>
      <div>go to docs</div>
      <div class="attribute-selector-docs-link" >
        <ExternalLink/>
      </div>
    </a>
  </div>
</div>


<style>
  .attribute-selector-container {
    margin-left: -3rem;
    padding-bottom: 1rem;
    background-color: transparent;
    display: block;
    position: relative;
    min-width: 100%;
  }

  .attribute-selector-interface {
    position: relative;
    display: grid;
    width: 100%;
    padding: 1rem;
    grid-auto-flow: row;
    grid-auto-columns: 1fr;
    grid-column-gap: 0.5rem;
    grid-row-gap: 0.5rem;
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    border-radius: 0.375rem;
    background-color: #474747;
    box-sizing: border-box;
  }

  .attribute-selector-block {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
  }

  .attribute-selector-docs {
    display: flex;
    margin-left: 3rem;
    padding: 0.25rem 1rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    border-radius: 0.375rem;
    background-color: rgba(17, 17, 17, 0.2);
    color: #979797;
    font-size: 0.875rem;
    text-decoration: none;
    max-width: 100%;
  }

  .attribute-selector-docs-link :global(svg) {
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
    width: 1rem;
    margin-left: 0.5rem;

  }

</style>
