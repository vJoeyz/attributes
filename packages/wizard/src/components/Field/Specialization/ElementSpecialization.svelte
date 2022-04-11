<script lang="ts">
  import Select from '@src/components/Field/Specialization/Form/Select/Select.svelte';

  export let changeFieldElement: any;
  export let fieldIndex: any;

  export let specializations: any[];


</script>

<div>Element</div>
<Select options={specializations} changeFieldElement={changeFieldElement} fieldIndex={fieldIndex}/>
