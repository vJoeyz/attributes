<script lang="ts">
  import Attribute from '@src/components/Layout/Attribute.svelte';
  import AttributeItem from '@src/components/Layout/AttributeItem.svelte';
  import AttributeSettings from '@src/components/Layout/AttributeSettings.svelte';
  import AttributeKey from '@src/components/Layout/AttributeKey.svelte';
  import AttributeItemHeader from '@src/components/Layout/AttributeItemHeader.svelte';
  import AttributeCheckbox from '@src/components/Layout/AttributeCheckbox.svelte';
  import AttributeItemContainer from '@src/components/Layout/AttributeItemContainer.svelte';
  import AttributeContainer from '@src/components/Layout/AttributeContainer.svelte';
  import AttributeLabel from '@src/components/Layout/AttributeLabel.svelte';
  import AttributeText from '@src/components/Layout/AttributeText.svelte';
  import AttributeToggle from '@src/components/Layout/AttributeToggle.svelte';
  import AttributeSelector from '@src/components/Layout/Selector/AttributeSelector.svelte';
  import AttributeFieldAdd from '@src/components/Layout/AttributeFieldAdd.svelte';
  import AttributeFieldDel from '@src/components/Layout/AttributeFieldDel.svelte';
  import FieldSpecialization from '@src/components/Field/Specialization/FieldSpecialization.svelte';
  import AttributeRequired from '@src/components/Layout/AttributeRequired.svelte';
  import FieldSettings from '@src/components/Schema/FieldSetting.svelte';
  import InputValidation from '../Layout/InputValidation.svelte';
  import type { FieldUI } from '@src/services/UI/UIService';
  import type { SchemaInputField, FieldChangeSpecialization, FieldChangeIdentifier, SchemaInputValidation } from '@src/types/Input.types';

  import {
    schemaFormActions,
    schemaForm,
    toggleAttributeSelector,
  } from '@src/stores';

  export let addField: () => void;
  export let deleteField: (fieldIndex: string) => void;
  export let field: FieldUI;
  export let fieldInput: SchemaInputField;

  export let changeFieldIdentifier: FieldChangeSpecialization;
  export let changeFieldElement: FieldChangeIdentifier;

  let hasSettings = field?.settings?.length > 0 || false;

  let isChecked = true;
  let isRequired = true;

  let fieldStatus: boolean | null = getInputStatus(fieldInput?.validation);


  let selectorId = `field-${field.key}-${fieldInput.index}`;
  let isOpenSelector = $toggleAttributeSelector === selectorId;

  function toggleSelector() {
    if (!isOpenSelector) {
      $toggleAttributeSelector = selectorId;
      return;
    }

    $toggleAttributeSelector = null;
    isOpenSelector = false;
  }


  function getInputStatus(validation: SchemaInputValidation | null | undefined): boolean | null {
    if (validation === null || validation === undefined) {
      return null;
    }

    return validation.status;
  }


  $: if ($schemaForm) {
    fieldInput = schemaFormActions.findField(field.key, fieldInput.index);
    fieldStatus = getInputStatus(fieldInput?.validation);
  }

  $: if ($toggleAttributeSelector) {
    isOpenSelector = $toggleAttributeSelector === selectorId;
  }

</script>

<Attribute>
  <AttributeItem id={selectorId} checked={isChecked} status={fieldStatus}>
    <AttributeItemHeader>
      <AttributeCheckbox
        onCheck={null}
        isChecked={isChecked}
        isRequired={isRequired}
        key={field.key}
        status={fieldStatus}
      />
      <AttributeItemContainer>
        <AttributeContainer>
          <AttributeLabel toggleSelector={toggleSelector}>
            <AttributeKey>
              {field.key}
            </AttributeKey>
            <AttributeText>
              {field.description}
              {#if fieldInput && fieldInput.index === 'field-1'}
                <AttributeRequired/>
              {/if}
            </AttributeText>
          </AttributeLabel>
          <AttributeToggle isOpen={isOpenSelector} toggleSelector={toggleSelector}/>

          {#if fieldInput && fieldInput.index !== 'field-1'}
            <AttributeFieldDel deleteField={() => deleteField(fieldInput && fieldInput.index || '')}/>
          {/if}

          <AttributeFieldAdd addField={addField}/>
        </AttributeContainer>
        {#if isOpenSelector}
          <AttributeSelector
            type="field"
            key={field.key}
            value={fieldInput.identifier}
            specialization={fieldInput.specialization}
          />
        {/if}
      </AttributeItemContainer>

    </AttributeItemHeader>
    {#if fieldInput && fieldInput.validation}
      {#each fieldInput.validation.messages as inputMessage}
        <InputValidation
          status={fieldInput.validation.status}
          message={inputMessage.message}
          type={inputMessage.type}
        />
      {/each}
    {/if}
    <FieldSpecialization
      specializations={field.specializations}
      changeFieldElement={changeFieldElement}
      changeFieldIdentifier={changeFieldIdentifier}
      fieldIndex={fieldInput}
    />
  </AttributeItem>
  {#if hasSettings}
    <AttributeSettings>
      {#each field.settings as setting}
        <FieldSettings
          fieldKey={field.key}
          fieldIndex={fieldInput.index}
          setting={setting}
          identifier={fieldInput.identifier}
        />
      {/each}
    </AttributeSettings>
  {/if}
</Attribute>
