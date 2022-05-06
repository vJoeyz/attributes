<script lang="ts">
  import Header from '@src/components/Layout/Header.svelte';
  import StatusIcon from '@src/components/Layout/Icons/StatusIcon.svelte';
  import ResultItem from '@src/components/Report/ReportHeader/ReportHeaderItem.svelte';

  import { schemaFormActions, schemaForm, schemaSettingsKey, schemaSettingsInstance } from '@src/stores';

  let invalidAttributes = schemaFormActions.findInvalidAttributes();
  let validAttributes = schemaFormActions.findValidAttributes();

  $: if ($schemaForm && $schemaSettingsInstance && $schemaSettingsKey) {
    invalidAttributes = schemaFormActions.findInvalidAttributes();
    validAttributes = schemaFormActions.findValidAttributes();
  }
</script>

<div class="tool_results">
  {#if validAttributes.length > 0 && invalidAttributes.length === 0}
    <Header>
      <div class="status">
        <StatusIcon status={true} /> Nice Job! Everything is ok!
      </div>
    </Header>
  {/if}
  {#if invalidAttributes.length > 0}
    <Header>
      <div class="status">
        <StatusIcon status={false} />
        {invalidAttributes.length}
        {invalidAttributes.length > 1 ? 'errors' : 'error'} found:
      </div>
    </Header>
    <div class="tool_results-list">
      {#each invalidAttributes as error}
        {#if error.validation}
          {#each error.validation?.messages as errorMessage}
            <div
              class="tool_results-item"
              data-testid="report-item"
              data-test={error.attributeId}
              data-error={errorMessage.type}
            >
              <ResultItem key={error.attributeKey} message={errorMessage.message || ''} id={`${error.attributeId}`} />
            </div>
          {/each}
        {/if}
      {/each}
    </div>
  {/if}

  <!-- {JSON.stringify(invalidAttributes)} -->
</div>

<style>
  .status {
    display: flex;
    flex-direction: flex-start;
    align-items: center;
  }

  .tool_results-list {
    justify-content: stretch;
    justify-items: stretch;
    align-items: stretch;
    align-content: stretch;
    border-bottom: 1px solid #000;
  }
</style>
