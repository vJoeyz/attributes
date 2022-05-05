<script lang="ts">
  export let value: number;
  export let id: string;
  export let min: number;
  export let max: number;
  export let label: string;

</script>

<label for={id}>{label}</label>
<input min={min} max={max} id={id} bind:value={value} type="number" />


<style>
  label {
    font-size: 0.8em;
  }
</style>
