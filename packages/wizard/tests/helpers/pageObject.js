import { Selector } from 'testcafe';



const wizardWrapper = Selector('[data-id="wizard-wrapper"]').shadowRoot();


/**
 * Walkthrought
 */
export const walkthrought = wizardWrapper.find('[data-testid="walkthrough"]');

/**
 * Header
 */
export const headerSection = wizardWrapper.find('[data-testid="walkthrough-header"]');
export const headerButton = headerSection.find('[data-testid="action"]');

export const attributeHeader = wizardWrapper.find('[data-testid="attribute-header"]')

/**
 * Attributes
 */
//export const attributesSection = Selector('[data-testid="walkthrough-attributes"]');
// export const attributesSelect = Selector('[data-testid="select-attribute"]');
export const attributesDisplay = wizardWrapper.find('[data-testid="select-attribute-display"]');

export const attributesOptions = wizardWrapper.find('[data-testid="select-attribute-option"]');

/**
 * Instances
 */
export const toggleInstances = wizardWrapper.find('[data-testid="select-attribute-toggle-instances"]');
export const inputInstances = wizardWrapper.find('[data-testid="select-attribute-input-instances"]');
export const moreInstances = wizardWrapper.find('[data-testid="select-attribute-more-instances"]');
export const minusInstances = wizardWrapper.find('[data-testid="select-attribute-minus-instances"]');

export const instanceButtons = wizardWrapper.find('[data-testid="select-attribute-instance"]');


// export const instancesSection = Selector('[data-testid="walkthrough-instances"]');
export const instancesMoreButton = wizardWrapper.find('#more-instances');
export const instancesInput = wizardWrapper.find('#instances');


/**
 * Select instance
 */
export const selectInstanceSection = wizardWrapper.find('[data-testid="walkthrough-select-instance"]');

/**
 * Schema
 */

export const getItemCheckbox = (attributeId) => {
  return wizardWrapper.find(`#${attributeId} label input[type=checkbox]`);
}

export const getItemToggle = (attributeId) => {
  return wizardWrapper.find(`#${attributeId} [data-testid="attribute-toggle"]`);
}
/**
 * Script
 */
export const scriptSection = Selector('[data-testid="walkthrough-script"]');

/**
 * Action
 */
export const actionSection = Selector('[data-testid="walkthrough-action"]');
export const actionButton = actionSection.find('[data-testid="action"]');

export const runCheckBtn = wizardWrapper.find('[data-testid="run-check"]');
export const resetBtn = Selector('[data-testid="reset"]');

/**
 * Report
 */
// export const reportSection = Selector('[data-testid="walkthrough-report"]');
// export const reportResponse = reportSection.find('[data-testid="report-list"]');

export const reportItems = wizardWrapper.find('[data-testid="report-item"]')


export const getAddFieldButton = (index = 1) => {
  const elements = wizardWrapper.find(`[data-testid="add-field"]`);

  return (elements.count > 1) ? elements[index - 1] : elements;
}


export const getReportError = (attributeId, index = 1) => {

  return wizardWrapper.find(`[data-test="${attributeId}"]`);
}

export const getAttributeError = (attributeId, index = 1) => {

  const elements = wizardWrapper.find(`#${attributeId} [data-testid="attribute-error"]`);

  return (elements.count > 1) ? elements[index - 1] : elements;
  //return Selector(`#${attributeId} [data-testid="attribute-error"]`);
}

export const getItemSelect = (attributeId) => {
  const elements = wizardWrapper.find(`#${attributeId} [data-testid="settings-select"]`);
  return (elements.count > 1) ? elements[index -1] : elements;
}

export const getItemSelectOptions = (attributeId) => {
  return wizardWrapper.find(`#${attributeId} [data-testid="settings-select-option"]`);
}

export const getItemInput = (attributeId) => {
  const elements = wizardWrapper.find(`#${attributeId} [data-testid="selector-input"]`);
  return (elements.count > 1) ? elements[index -1] : elements;
}

export const getFieldIdentifier = (attributeId) => {
  return wizardWrapper.find(`#${attributeId} [data-testid="field-identifier"]`);
}


export const getFieldSpecialization = (attributeId) => {

  return wizardWrapper.find(`#${attributeId} [data-testid="field-specialization"]`);
}

export const getFieldSpecializationOptions = (attributeId) => {
  return wizardWrapper.find(`#${attributeId} [data-testid="field-specialization-option"]`);
}
