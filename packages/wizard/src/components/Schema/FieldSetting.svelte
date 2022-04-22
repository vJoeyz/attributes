<script lang="ts">
  import AttributeItem from '@src/components/Layout/AttributeItem.svelte';
  import AttributeKey from '@src/components/Layout/AttributeKey.svelte';
  import AttributeItemHeader from '@src/components/Layout/AttributeItemHeader.svelte';
  import AttributeCheckbox from '@src/components/Layout/AttributeCheckbox.svelte';
  import AttributeItemContainer from '@src/components/Layout/AttributeItemContainer.svelte';
  import AttributeContainer from '@src/components/Layout/AttributeContainer.svelte';
  import AttributeLabel from '@src/components/Layout/AttributeLabel.svelte';
  import AttributeText from '@src/components/Layout/AttributeText.svelte';
  import AttributeToggle from '@src/components/Layout/AttributeToggle.svelte';
  import AttributeSelector from '@src/components/Layout/Selector/AttributeSelector.svelte'
  import InputValidation from '@src/components/Layout/InputValidation.svelte';
  import { checkSettingCondition } from '@src/services/Attributes/Schema/SchemaService';
  import { schemaForm, schemaFormActions, toggleAttributeSelector } from '@src/stores';
  import type { AttributeSettingSchema } from '@global/types/schema';
  import type { SchemaInput, SchemaInputFieldSetting } from '@src/types/Input.types';
  export let setting: AttributeSettingSchema;
  export let fieldKey: string;
  export let fieldIndex: string;
  export let identifier: string;

  let option: string = schemaFormActions.getFieldSettingOption(fieldKey, fieldIndex, setting.key) || '';

  let isEnable = true;

  let schemaInput: SchemaInputFieldSetting | undefined = schemaFormActions.findFieldSetting(fieldKey, fieldIndex, setting.key);

  let isChecked: boolean = !!schemaInput;

  function onCheck(event: Event) {
    const input = event.target as HTMLInputElement;
    const { checked } = input;
    if (checked) {

      let checkedOption: string = option || setting.value.default || '';

      let index = schemaFormActions.findFieldSettingIndex(fieldKey, fieldIndex, setting.key);

      if (index === null) {
        schemaFormActions.addFieldSetting(fieldKey, fieldIndex, setting.key, checkedOption);
      } else {
        schemaFormActions.enableFieldSetting(fieldKey, fieldIndex, setting.key);
      }
    } else {
      schemaFormActions.disableFieldSetting(fieldKey, fieldIndex, setting.key)
    }
  }


  function checkIsEnable(schemaForm: SchemaInput[]) {


    const localEnable = checkSettingCondition(setting, schemaForm);

    if (localEnable === false && isChecked === true) {
      schemaFormActions.disableFieldSetting(fieldKey, fieldIndex, setting.key);
      isChecked = false;
    }

    if (isEnable !== localEnable) {
      isEnable = localEnable;
    }
  }


  let selectorId = `field-setting-${fieldKey}-${fieldIndex}-${setting.key}`;
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
    let index: number | null = schemaFormActions.findFieldSettingIndex(fieldKey, fieldIndex, setting.key);

    if (index !== null && ($schemaForm[index] as SchemaInputFieldSetting).option !== value) {
      schemaFormActions.setFieldSettingOption(fieldKey, fieldIndex, setting.key, value);
    }
  }


  $: {
    checkIsEnable($schemaForm);
    schemaInput = schemaFormActions.findFieldSetting(fieldKey, fieldIndex, setting.key);

    if (schemaInput && schemaInput.enable === false) {
      isChecked = false;
    } else {
      isChecked = !!schemaInput;
    }
  }

  $: if ($toggleAttributeSelector) {
    isOpenSelector = $toggleAttributeSelector === selectorId;
  }
</script>


<AttributeItem id={selectorId} checked={isChecked}>
  <AttributeItemHeader>
    <AttributeCheckbox
      onCheck={onCheck}
      isChecked={isChecked}
      isRequired={false}
      key={setting.key}
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
      {#if isOpenSelector && setting.specializations === undefined}
        <AttributeSelector
          type="fieldSetting"
          key={setting.key}
          fieldKey={fieldKey}
          identifier={identifier}
          valueType={setting.value}
          value={schemaInput && schemaInput.option || ''}
          isActive={!!schemaInput && schemaInput.enable}
          onChange={onChange}
        />
      {:else if isOpenSelector && setting.specializations}
        {#each setting.specializations as specilization}
            <AttributeSelector
              type="fieldSetting"
              identifier={identifier}
              fieldKey={fieldKey}
              forceStatic
              key={setting.key}
              valueType={setting.value}
              value={specilization.value}
              isActive={!!schemaInput && schemaInput.enable}
              onChange={onChange}
            />
        {/each}
      {/if}
    </AttributeItemContainer>
  </AttributeItemHeader>
  {#if schemaInput && schemaInput.validation && schemaInput.enable}
    {#each schemaInput.validation.messages as inputMessage}
      <InputValidation
        status={schemaInput.validation.status}
        message={inputMessage.message}
        type={inputMessage.type}
      />
    {/each}
  {/if}

</AttributeItem>
