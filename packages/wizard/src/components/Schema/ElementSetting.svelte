<script lang="ts">
  import AttributeItem from '@src/components/Layout/AttributeItem.svelte';
  import { checkSettingCondition } from '@src/services/Attributes/Schema/SchemaService';
  import AttributeKey from '@src/components/Layout/AttributeKey.svelte';
  import AttributeItemHeader from '@src/components/Layout/AttributeItemHeader.svelte';
  import AttributeCheckbox from '@src/components/Layout/AttributeCheckbox.svelte';
  import AttributeItemContainer from '@src/components/Layout/AttributeItemContainer.svelte';
  import AttributeContainer from '@src/components/Layout/AttributeContainer.svelte';
  import AttributeLabel from '@src/components/Layout/AttributeLabel.svelte';
  import AttributeText from '@src/components/Layout/AttributeText.svelte';
  import AttributeToggle from '@src/components/Layout/AttributeToggle.svelte';
  import AttributeSelector from '@src/components/Layout/Selector/AttributeSelector.svelte';
  import InputValidation from '@src/components/Layout/InputValidation.svelte';
  import { schemaForm, schemaFormActions, schemaSettingsInstance, toggleAttributeSelector } from '@src/stores';
  import type { AttributeSettingSchema } from '@global/types/schema';
  import type { SchemaInput, SchemaInputElementSetting, SchemaInputValidation } from '@src/types/Input.types';

  export let setting: AttributeSettingSchema;
  export let parent: string;

  let option: string = schemaFormActions.getElementSettingOption(parent, setting.key) || '';

  let isEnable = true;

  let elementSettingInput = schemaFormActions.findElementSetting(parent, setting.key);
  let elementSettingStatus: boolean | null = getInputStatus(elementSettingInput?.validation);

  let isChecked = !!elementSettingInput;

  function onCheck(event: Event) {

    const input = event.target as HTMLInputElement;
    const { checked } = input;
    if (checked) {

      let checkedOption: string = option || setting.value.default || '';

      let index = schemaFormActions.findElementSettingIndex(parent, setting.key);
      if (index === null) {
          schemaFormActions.addElementSetting(parent, setting.key, checkedOption)
      } else {
          schemaFormActions.enableElementSetting(parent, setting.key);
      }
    } else {
        schemaFormActions.disableElementSetting(parent, setting.key);
    }
  }


  function checkIsEnable(schemaForm: SchemaInput[]) {
    const localEnable = checkSettingCondition(setting, schemaForm);

    if (localEnable === false && isChecked === true) {
      schemaFormActions.disableElementSetting(parent, setting.key);
      isChecked = false;
    }

    if (isEnable !== localEnable) {
      isEnable = localEnable;
    }
  }

  function getInputStatus(validation: SchemaInputValidation | null | undefined): boolean | null {
    if (validation === null || validation === undefined) {
      return null;
    }

    return validation.status;
  }


  let selectorId = `element-setting-${setting.key}`;
  let isOpenSelector = $toggleAttributeSelector === selectorId;

  function toggleSelector() {
    if (!isOpenSelector) {
      $toggleAttributeSelector = selectorId;
      return;
    }

    $toggleAttributeSelector = null;
    isOpenSelector = false;
  }


  function onChange(value: string) {
    let index = $schemaForm.findIndex(
      (item) => item.type === 'elementSetting' && item.setting === setting.key && item.element === parent
    );

    if (index !== -1 && ($schemaForm[index] as SchemaInputElementSetting).option !== value) {
      schemaFormActions.setElementSettingOption(parent, setting.key, value);
    }
  }

  $: if ($schemaForm) {
    checkIsEnable($schemaForm);

    elementSettingInput = schemaFormActions.findElementSetting(parent, setting.key);
    elementSettingStatus = getInputStatus(elementSettingInput?.validation);
  }

  $: if ($schemaSettingsInstance) {
    elementSettingInput = schemaFormActions.findElementSetting(parent, setting.key);
    elementSettingStatus = getInputStatus(elementSettingInput?.validation);

    if (elementSettingInput && elementSettingInput.enable === false) {
      isChecked = false;
    } else {
      isChecked = !!elementSettingInput;
    }
  }

  $: if ($toggleAttributeSelector) {
    isOpenSelector = $toggleAttributeSelector === selectorId;
  }

</script>


<AttributeItem id={selectorId} disabled={!isEnable} checked={isChecked} status={elementSettingStatus}>
  <AttributeItemHeader>
    <AttributeCheckbox
      onCheck={onCheck}
      isChecked={isChecked}
      isRequired={false}
      key={setting.key}
      disabled={!isEnable}
      status={elementSettingStatus}
    />
    <AttributeItemContainer>
      <AttributeContainer>
        <AttributeLabel toggleSelector={toggleSelector}>
          <AttributeKey>
            {setting.key}
          </AttributeKey>
          <AttributeText>
            {setting.description}

          </AttributeText>
        </AttributeLabel>
        <AttributeToggle isOpen={isOpenSelector} toggleSelector={toggleSelector}/>
      </AttributeContainer>
      {#if isOpenSelector}
        <AttributeSelector
          type="elementSetting"
          key={setting.key}
          valueType={setting.value}
          value={elementSettingInput && elementSettingInput.option || ''}
          isActive={!!elementSettingInput && elementSettingInput.enable}
          onChange={onChange}
        />
      {/if}
    </AttributeItemContainer>
  </AttributeItemHeader>
  {#if elementSettingInput && elementSettingInput.validation && elementSettingInput.enable}
    {#each elementSettingInput.validation.messages as inputMessage}
      <InputValidation
        status={elementSettingInput.validation.status}
        message={inputMessage.message}
        type={inputMessage.type}
      />
    {/each}
  {/if}
</AttributeItem>


<!-- {#if isEnable}
  <PanelTrigger>
    <Checkbox
      disabled={false}
      onChange={onCheck}
      bind:isChecked={isChecked}
      value={setting.key}
      label={setting.description}
      required={false}
    />
    <PanelHighlight>
      <Highlight appliedTo={setting.appliedTo} conditions={setting.conditions} />
    </PanelHighlight>
  </PanelTrigger>
  {#if isChecked}
    <PanelDetail>
      <SettingOptions value={setting.value} id={setting.key} bind:option />
      <SelectorSnippet attribute={`fs-${$schemaSettingsKey}-${setting.key}`} value={option} />
    </PanelDetail>
  {/if}
{/if} -->
