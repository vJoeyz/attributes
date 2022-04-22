<script>
  import Header from '@src/components/Layout/Header.svelte';
  import Element from '@src/components/Schema/Element.svelte';
  import FieldsList from '@src/components/Schema/FieldsList.svelte';
  import Results from '@src/components/Layout/Results/Results.svelte';

  import {
    schemaSelected,
    schemaSettingsInstance,
  } from '@src/stores';


  export let requiredElements = [];
  export let fields = [];
  export let nonRequiredElements = [];

</script>


<div id="wizard-attributes">
  <Header>
    <div data-testid="attribute-header">
      Check {$schemaSelected && $schemaSelected.title} - Instance #{$schemaSettingsInstance}
   </div>
  </Header>
  <Results/>
  {#if requiredElements.length > 0}
    {#each requiredElements as element}
      <Element element={element}/>
    {/each}
  {/if}
  <div class="fields">
    {#if fields.length > 0}
      {#each fields as field}
        <FieldsList field={field}/>
      {/each}
    {/if}
  </div>
  <div class="non-required">
  {#if nonRequiredElements.length > 0}
    <Header>
      <div>Aditional Elements</div>
    </Header>
    {#each nonRequiredElements as element}
      <Element element={element}/>
    {/each}
  {/if}
  </div>
</div>
