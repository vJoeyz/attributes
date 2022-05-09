<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';

  import { intValidator } from '@src/services/Validators/Int/IntValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;

  attributeValue = attributeValue || value.default || '';
</script>

<InputController validate={intValidator} let:inputValidator let:isTouched let:isValid>
  <Input
    disabled={!isActive}
    on:change
    {inputValidator}
    {id}
    type="number"
    {isTouched}
    {isValid}
    bind:value={attributeValue}
  />
</InputController>
