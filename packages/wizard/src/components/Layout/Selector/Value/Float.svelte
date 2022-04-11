<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';

  import SettingsValue from '@src/components/Layout/Settings/SettingsValue.svelte';
  import { floatValidator } from '@src/services/Validators/Float/FloatValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;
  export let onChange: any;
  attributeValue = attributeValue || value.default || '';

</script>


  <InputController validate={floatValidator} let:inputValidator let:isTouched let:isValid>
    <Input
      disabled={!isActive}
      onChange={onChange}
      {inputValidator}
      {id}
      type="number"
      step="0.01"
      {isTouched}
      {isValid}
      label="Float:"
      bind:value={attributeValue}
    />
  </InputController>
