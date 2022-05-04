<script lang="ts">
  import Options from './Editable/Options.svelte';
  import String from './Editable/String.svelte';
  import CommaSeparatedString from './Editable/CommaSeparatedString.svelte';
  import Float from './Editable/Float.svelte';
  import CommaSeparatedFloat from './Editable/CommaSeparatedFloat.svelte';
  // import Boolean from './Value/Boolean.svelte';
  import Int from './Editable/Int.svelte';
  import CommaSeparatedInt from './Editable/CommaSeparatedInt.svelte';
  import type { AttributeSettingValuePrimitive, AttributeSettingValueOptions } from '$global/types/schema';

  export let id: string;
  export let value: AttributeSettingValuePrimitive | AttributeSettingValueOptions;
  export let option: string;
  export let isActive: boolean;
  export let onChange: (value: string) => void;
</script>

<div class="selector__options">
  {#if value.type === 'options'}
    <Options onChange={onChange} isActive={isActive} bind:attributeValue={option} {value} />
  {:else if value.type === 'string'}
    <String onChange={onChange} isActive={isActive} bind:attributeValue={option} {value} {id} />
  {:else if value.type === 'commaSeparatedString'}
    <CommaSeparatedString onChange={onChange} isActive={isActive} bind:attributeValue={option} {value} {id} />
  {:else if value.type === 'float'}
    <Float onChange={onChange} isActive={isActive} bind:attributeValue={option} {value} {id} />
  {:else if value.type === 'commaSeparatedFloat'}
    <CommaSeparatedFloat onChange={onChange} isActive={isActive} bind:attributeValue={option} {id} {value} />
  {:else if value.type === 'int'}
    <Int onChange={onChange} isActive={isActive} bind:attributeValue={option} {value} {id} />
  {:else if value.type === 'commaSeparatedInt'}
    <CommaSeparatedInt onChange={onChange} isActive={isActive} bind:attributeValue={option} {id} {value} />
  <!-- {:else if value.type === 'boolean'}
    <Boolean bind:attributeValue={option} {id} /> -->
  {:else}
    <div class="missing">Missing componenent for ${value.type}</div>
  {/if}
</div>

<style>
  .selector__options {
    display: block;
    font-size: 0.875rem;
    line-height: 1.5;
    font-weight: 400;
    letter-spacing: 0.02rem;
    box-sizing: border-box;
    color: #ccc;
  }
</style>
