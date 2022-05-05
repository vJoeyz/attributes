<script lang="ts">
  export let disabled = false;
  export let onChange: (event: Event) => void;
  export let value: string;
  export let required = false;
  export let label: string;
  export let isChecked: boolean;
</script>

<label>
  <input {disabled} on:change={(!disabled && onChange) || undefined} bind:checked={isChecked} {value} type="checkbox" />

  {label}
  {#if required}
    <span>*</span>
  {/if}
</label>

<style>
  label {
    width: 100%;
    text-align: left;
    vertical-align: top;
  }

  input {
    margin: 0;
    padding: 0;
    vertical-align: top;
  }
</style>
