<script lang="ts">
  import debounce from '@src/utils/debounce';
  import Field from '@src/components/Schema/Field.svelte';
  import type { FieldUI } from '@src/services/UI/UIService';
  import {
    schemaFormActions,
    schemaSettingsInstance
  } from '@src/stores';
  import type { SchemaInputField } from '@src/types/Input.types';

  export let field: FieldUI;

  let timer: NodeJS.Timeout;

  let fields: SchemaInputField[] =  schemaFormActions.getFields();


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
      setTimeout(() => {
        const lastField = document.querySelector('div.fields > .tool_wizard:last-child');
        if (lastField) {
          lastField.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  }

  function deleteField(fieldIndex: string) {
    schemaFormActions.deleteField(field.key, fieldIndex);
    fields = schemaFormActions.getFields();

    setTimeout(() => {
        const lastField = document.querySelector('div.fields > .tool_wizard:last-child');
        if (lastField) {
          lastField.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 100);
  }

  function changeFieldElement(fieldIndex: string, value: string) {
    schemaFormActions.setFieldSpecialization(field.key, fieldIndex, value);
    fields = schemaFormActions.getFields();
  }

  function changeFieldIdentifier(fieldIndex: string, value: string) {
    debounce(timer, () => {
      schemaFormActions.setFieldValue(field.key, fieldIndex, value);
      fields = schemaFormActions.getFields();
    });
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
{#each fields as fieldInstance (fieldInstance)}
  <Field
    addField={addField}
    deleteField={deleteField}
    field={field}
    fieldInstance={fieldInstance}
    changeFieldElement={changeFieldElement}
    changeFieldIdentifier={changeFieldIdentifier}
  />
{/each}
