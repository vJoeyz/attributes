<script lang="ts">
  import Input from '@src/components/Layout/Form/Input.svelte';
  import InputController from '@src/components/Layout/Form/InputController.svelte';

  import { commaSeparatedIntValidator } from '@src/services/Validators/Int/IntValidator';

  export let value: { default?: string };
  export let attributeValue: string;
  export let id: string;
  export let isActive: boolean;
  export let onChange: (value: string) => void;
  attributeValue = attributeValue || value.default || '';
</script>

<InputController validate={commaSeparatedIntValidator} let:inputValidator let:isTouched let:isValid>
  <Input
    disabled={!isActive}
    {onChange}
    {inputValidator}
    {id}
    type="text"
    {isTouched}
    {isValid}
    pattern="[0-9]+([,][0-9]+)?"
    bind:value={attributeValue}
  />
</InputController>
