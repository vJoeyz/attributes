import { Selector } from 'testcafe';


/**
 * Walkthrought
 */
export const walkthrought = Selector('[data-testid="walkthrough"]');

/**
 * Header
 */
export const headerSection = Selector('[data-testid="walkthrough-header"]');
export const headerButton = headerSection.find('[data-testid="action"]');

export const attributeHeader = Selector('[data-testid="attribute-header"]')

/**
 * Attributes
 */
//export const attributesSection = Selector('[data-testid="walkthrough-attributes"]');
export const attributesSelect = Selector('[data-testid="select-attribute"]');
export const attributesDisplay = Selector('[data-testid="select-attribute-display"]');
export const attributesOptions = Selector('[data-testid="select-attribute-option"]');

/**
 * Instances
 */
export const toggleInstances = Selector('[data-testid="select-attribute-toggle-instances"]');
export const inputInstances = Selector('[data-testid="select-attribute-input-instances"]');
export const moreInstances = Selector('[data-testid="select-attribute-more-instances"]');
export const minusInstances = Selector('[data-testid="select-attribute-minus-instances"]');

export const instanceButtons = Selector('[data-testid="select-attribute-instance"]');


// export const instancesSection = Selector('[data-testid="walkthrough-instances"]');
export const instancesMoreButton = Selector('#more-instances');
export const instancesInput = Selector('#instances');


/**
 * Select instance
 */
export const selectInstanceSection = Selector('[data-testid="walkthrough-select-instance"]');

/**
 * Schema
 */

// export const schemaSection = Selector('[data-testid="walkthrough-schema"]');
// export const schemaElementsSection = Selector('[data-testid="walkthrough-schema-elements"]');
// export const schemaSettingsSection = Selector('[data-testid="walkthrough-schema-settings"]');
export const getItemCheckbox = (attributeId) => {

  return Selector(`#${attributeId} label input[type=checkbox]`);
}

export const getItemToggle = (attributeId) => {
  return Selector(`#${attributeId} [data-testid="attribute-toggle"]`);
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

export const runCheckBtn = Selector('[data-testid="run-check"]');
export const resetBtn = Selector('[data-testid="reset"]');

/**
 * Report
 */
// export const reportSection = Selector('[data-testid="walkthrough-report"]');
// export const reportResponse = reportSection.find('[data-testid="report-list"]');

export const reportItems = Selector('[data-testid="report-item"]')


export const getAddFieldButton = (index = 1) => {
  const elements = Selector(`[data-testid="add-field"]`);

  return (elements.count > 1) ? elements[index - 1] : elements;
}


export const getReportError = (attributeId, index = 1) => {

  return Selector(`[data-test="${attributeId}"]`);
}

export const getAttributeError = (attributeId, index = 1) => {

  const elements = Selector(`#${attributeId} [data-testid="attribute-error"]`);

  return (elements.count > 1) ? elements[index - 1] : elements;
  //return Selector(`#${attributeId} [data-testid="attribute-error"]`);
}

export const getItemSelect = (attributeId) => {
  const elements = Selector(`#${attributeId} [data-testid="settings-select"]`);
  return (elements.count > 1) ? elements[index -1] : elements;
}

export const getItemSelectOptions = (attributeId) => {
  return Selector(`#${attributeId} [data-testid="settings-select-option"]`);
}

export const getItemInput = (attributeId) => {
  const elements = Selector(`#${attributeId} [data-testid="selector-input"]`);
  return (elements.count > 1) ? elements[index -1] : elements;
}

export const getFieldIdentifier = (attributeId) => {
  return Selector(`#${attributeId} [data-testid="field-identifier"]`);
}


export const getFieldSpecialization = (attributeId) => {

  return Selector(`#${attributeId} [data-testid="field-specialization"]`);
}

export const getFieldSpecializationOptions = (attributeId) => {
  return Selector(`#${attributeId} [data-testid="field-specialization-option"]`);
}
