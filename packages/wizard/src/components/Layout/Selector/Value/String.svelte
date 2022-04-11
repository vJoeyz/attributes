<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';

  import SettingsValue from '@src/components/Layout/Settings/SettingsValue.svelte';
  import { stringValidator } from '@src/services/Validators/String/StringValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;
  export let onChange: any;

  attributeValue = attributeValue || value.default || '';
</script>

<SettingsValue>
  <InputController validate={stringValidator} let:inputValidator let:isTouched let:isValid>
    <Input
      disabled={!isActive}
      onChange={onChange}
      {inputValidator}
      {id}
      type="text"
      {isTouched}
      {isValid}
      label="Text:"
      bind:value={attributeValue}
    />
  </InputController>
</SettingsValue>
