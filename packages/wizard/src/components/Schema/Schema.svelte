<script lang="ts">
  import UIService, { ElementUI, FieldUI } from '@src/services/UI/UIService';
  import Attributes from '@src/components/Schema/Attributes.svelte';

  import {
    schemaSettingsKey,
    schemaData,
    schemaMode,
    SCHEMA_MODES,
  } from '@src/stores';

  let requiredElements: ElementUI[];
  let fields: FieldUI[];
  let nonRequiredElements: ElementUI[];

  $: {
    if ($schemaData) {

      const schemaUI = UIService('', $schemaData);

      if (schemaUI) {
        requiredElements = schemaUI.requiredElements;
        fields = schemaUI.fields;
        nonRequiredElements = schemaUI.notRequiredElements;
      }
    }
  }

</script>


{#if $schemaSettingsKey && $schemaMode === SCHEMA_MODES.READY}
<Attributes
  nonRequiredElements={nonRequiredElements}
  requiredElements={requiredElements}
  fields={fields}
/>
{/if}
