<script lang="ts">
  // import debounce from '@src/utils/debounce';
  import Field from '@src/components/Schema/Field.svelte';
  import type { FieldUI } from '@src/types/Schema.types';
  import { scrollInto } from '@src/services/DOM/Utils/Utils';
  import { schemaFormActions, schemaSettingsInstance } from '@src/stores';
  import type { SchemaInputField } from '@src/types/Input.types';

  export let field: FieldUI;

  let fields: SchemaInputField[] = schemaFormActions.getFields();

  if (fields.length === 0) {
    addField();
  }

  function addField() {
    const lastIndex = schemaFormActions.addField(field.key);

    if (field.specializations.length === 1) {
      schemaFormActions.setFieldSpecialization(field.key, lastIndex, field.specializations[0].key);
    }

    fields = schemaFormActions.getFields();

    if (fields.length > 1) {
      scrollInto('div.fields > .tool_support:last-child', 200);
    }
  }

  function deleteField(fieldIndex: string) {
    schemaFormActions.deleteField(field.key, fieldIndex);
    schemaFormActions.disableFieldSettings(field.key, fieldIndex);
    fields = schemaFormActions.getFields();

    scrollInto('div.fields > .tool_support:last-child', 200);
  }

  function changeFieldElement(fieldIndex: string, value: string) {
    schemaFormActions.setFieldSpecialization(field.key, fieldIndex, value);
    fields = schemaFormActions.getFields();
  }

  function changeFieldIdentifier(fieldIndex: string, value: string) {
    schemaFormActions.setFieldValue(field.key, fieldIndex, value);
  }

  $: {
    fields = schemaFormActions.getFields();
  }

  $: if ($schemaSettingsInstance) {
    fields = schemaFormActions.getFields();
    if (fields.length === 0) {
      addField();
    }
  }
</script>

{#each fields as fieldInput (fieldInput)}
  <Field {addField} {deleteField} {field} {fieldInput} {changeFieldElement} {changeFieldIdentifier} />
{/each}
