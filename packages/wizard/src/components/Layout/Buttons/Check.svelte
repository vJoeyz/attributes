<script lang="ts">
  import { validateInputForm } from '@src/services/Attributes/AttributesService';

  import {
    schemaData,
    schemaForm,
    schemaSettingsInstance,
    schemaSettingsStandalone,
    schemaSettingsKey,
    VALIDATE_MODES,
    validatingMode,
    isSubmitted,
  } from '@src/stores';

  async function validateForm() {

    if (!$schemaData) {
      return;
    }

    if ($schemaSettingsKey === null) {
      return;
    }

    const schemaSettings =  {
      key: $schemaSettingsKey,
      standalone: $schemaSettingsStandalone,
      instance: $schemaSettingsInstance,
    };

    $validatingMode = VALIDATE_MODES.VALIDATING;

    $schemaForm = await validateInputForm(
      $schemaForm,
      $schemaData,
      schemaSettings,
      //scriptFile
    );

    setTimeout(() => {
      const container = document.getElementById('wizard-internal');
      if (container) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }, 100);

    setTimeout(function() {
      $validatingMode = VALIDATE_MODES.READY;
    }, 1000)


    $isSubmitted = true;
  }
</script>

<button on:click={validateForm} data-testid="run-check">
  Run Check
</button>

<style>
  button {
    position: relative;
    left: 0%;
    top: auto;
    right: 0%;
    bottom: 0%;
    z-index: 99;
    width: 100%;
    padding: 0.75rem 2rem;
    flex: 1;
    border-radius: 0.375rem;
    background-color: #bcfd2e;
    color: #1a1a1a;
    font-size: 1.25rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    display: inline-block;
    border: 0;
    text-decoration: none;
    cursor: pointer;
    box-sizing: border-box;
  }
</style>
