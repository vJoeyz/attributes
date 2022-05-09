<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';

  import { commaSeparatedStringValidator } from '@src/services/Validators/String/StringValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;
  export let onChange: (value: string) => void;

  attributeValue = attributeValue || value.default || '';
</script>

<InputController validate={commaSeparatedStringValidator} let:inputValidator let:isTouched let:isValid>
  <Input
    disabled={!isActive}
    {onChange}
    {inputValidator}
    {id}
    type="text"
    {isTouched}
    {isValid}
    bind:value={attributeValue}
  />
</InputController>
