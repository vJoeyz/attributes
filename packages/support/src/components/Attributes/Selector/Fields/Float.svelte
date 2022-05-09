<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';
  import { floatValidator } from '@src/services/Validators/Float/FloatValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;
  export let onChange: (value: string) => void;
  attributeValue = attributeValue || value.default || '';
</script>

<InputController validate={floatValidator} let:inputValidator let:isTouched let:isValid>
  <Input
    disabled={!isActive}
    {onChange}
    {inputValidator}
    {id}
    type="number"
    step="0.01"
    {isTouched}
    {isValid}
    bind:value={attributeValue}
  />
</InputController>
