<script lang="ts">
  import ElementSetting from '@src/components/Schema/ElementSetting.svelte';
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
  import AttributeRequired from '@src/components/Layout/AttributeRequired.svelte';
  import AttributeToggle from '@src/components/Layout/AttributeToggle.svelte';
  import AttributeSelector from '@src/components/Layout/Selector/AttributeSelector.svelte';
  import InputValidation from '../Layout/InputValidation.svelte';
  import { checkSettingCondition } from '@src/services/Attributes/Schema/SchemaService';
  import {
    schemaFormActions,
    schemaForm,
    schemaSettingsInstance,
    toggleAttributeSelector,
  } from '@src/stores';
  import type { ElementUI } from '@src/services/UI/UIService';
  import type { SchemaInput, SchemaInputValidation } from '@src/types/Input.types';

  // attribute config
  export let element: ElementUI;
  let hasSettings = element?.settings?.length > 0 || false;
  let isRequired = element.required;

  // form config
  let elementInput: SchemaInput | null = schemaFormActions.findElement(element.key);
  let isEnable = true;
  let isChecked = !!elementInput;
  let elementStatus: boolean | null = getInputStatus(elementInput?.validation);

  console.log('element status', elementStatus);

  if (isRequired && !isChecked) {
    isChecked = true;
    schemaFormActions.addElement(element.key);
  }

  function onCheck(event: Event): void {
    const input = event.target as HTMLInputElement;

    const { checked, value } = input;

    if (checked) {
      schemaFormActions.addElement(value);
      isChecked = true;
    } else {
      if (!isRequired) {
        schemaFormActions.removeElement(value);
        isChecked = false;
      }
    }
  }

  function checkIsEnable(schemaForm: SchemaInput[]) {
    const localEnable = checkSettingCondition(element, schemaForm);

    if (localEnable === false && isChecked === true) {
      schemaFormActions.removeElement(element.key);
      isChecked = false;
    }

    if (isEnable !== localEnable) {
      isEnable = localEnable;
    }
  }

  // selector config
  let selectorId = `element-${element.key}`;
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

  $: {
    checkIsEnable($schemaForm);
    elementInput = schemaFormActions.findElement(element.key);
    elementStatus = getInputStatus(elementInput?.validation);
  }

  $: if ($schemaSettingsInstance) {
    elementInput = schemaFormActions.findElement(element.key);
    elementStatus = getInputStatus(elementInput?.validation);

    if (element.required && !elementInput) {
      isChecked = true;
      schemaFormActions.addElement(element.key);
    } else {

      isChecked = !!elementInput
    }
  }

  $: if ($toggleAttributeSelector) {
    isOpenSelector = $toggleAttributeSelector === selectorId;
  }
</script>


<Attribute>
  <AttributeItem
    id={selectorId}
    disabled={!isEnable}
    checked={isChecked}
    status={elementStatus}
  >
    <AttributeItemHeader>
      <AttributeCheckbox
        onCheck={onCheck}
        isChecked={isChecked}
        isRequired={isRequired}
        key={element.key}
        disabled={!isEnable}
        status={elementStatus}
      />
      <AttributeItemContainer>
        <AttributeContainer>
          <AttributeLabel toggleSelector={toggleSelector}>
            <AttributeKey>
              {element.key}
            </AttributeKey>
            <AttributeText>
              {element.description}
              {#if element.required}
                <AttributeRequired/>
              {/if}
            </AttributeText>
          </AttributeLabel>
          <AttributeToggle isOpen={isOpenSelector} toggleSelector={toggleSelector} />
        </AttributeContainer>
        {#if isOpenSelector}
          <AttributeSelector
            type="element"
            key={element.key}
            value={undefined}
          />
        {/if}
      </AttributeItemContainer>

    </AttributeItemHeader>
    {#if elementInput && elementInput.validation}
      {#each elementInput.validation.messages as inputMessage}
        <InputValidation
          status={elementInput.validation.status}
          message={inputMessage.message}
          type={inputMessage.type}
        />
      {/each}
    {/if}
  </AttributeItem>
  {#if hasSettings}
    <AttributeSettings>
      {#each element.settings as setting}
        <ElementSetting parent={element.key} setting={setting}/>
      {/each}
    </AttributeSettings>
  {/if}
</Attribute>
