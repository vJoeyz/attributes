import { t } from 'testcafe';
import {
  attributesDisplay,
  inputInstances,
  attributeHeader,
  reportItems,
  getReportError,
  getAttributeError
} from './pageObject';


export async function assertAttributeSelected(attribute) {
  await t.expect(attributesDisplay.innerText).eql(attribute);
}


export async function assertInstancesCount(value) {
  await t.expect(inputInstances.value).eql(`${value}`);
}

export async function assertInstanceSelected(value) {
  await t.expect(instanceButtons.withText(`${value}`).hasClass('selected')).ok();
}

export async function assertHeaderTitle(attribute, instance) {
  await t.expect(attributeHeader).eql(`Check ${attribute} - Instance #${instance}`);
}

export async function assertErrorsCountOnReport(count) {
  await t.expect(reportItems.count).eql(count, 'check errors count', { timeout: 5000});
}


export async function assertErrorIsOnReport(attributeId, errorType, index = 1) {
  await t.expect(
    getReportError(attributeId, index).getAttribute('data-error')
  ).eql(errorType, `check error ${attributeId}=${errorType}`, { timeout: 5000});
}

export async function assertErrorIsOnAttribute(attributeId, errorType, index = 1) {
  await t.expect(
    getAttributeError(attributeId, index).getAttribute('data-error')
  ).eql(errorType, `check error ${attributeId}=${errorType}`, { timeout: 5000});
}


export async function assertSuccess(attributeId, index = 1) {
  await t.expect(
    getAttributeError(attributeId, index).getAttribute('data-error')
  ).eql('success', `check success ${attributeId}`, { timeout: 5000});
}


// export async function assertSuccessValidation() {
//   await t.expect(reportSection.find('[data-testid="report-empty"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="many-errors"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="error"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="no-errors"]').exists).ok();
// }

// export async function assertExpectedValidationError(type, name, typeError, selector) {

//   const elementDOM = reportResponse.find(`[data-testid="report-error-${type}-${name}"]`);

//   await t.expect(elementDOM.exists).ok();
//   await t.expect(elementDOM.getAttribute('data-type')).eql(type);
//   await t.expect(elementDOM.getAttribute('data-error-type')).eql(typeError);
//   await t.expect(elementDOM.getAttribute('data-selector')).eql(selector);

// }

// export async function assertExpectedValidationSuccess(type, name, selector) {
//   const elementDOM = reportResponse.find(`[data-testid="report-success-${type}-${name}"]`);

//   await t.expect(elementDOM.exists).ok();
//   await t.expect(elementDOM.getAttribute('data-type')).eql(type);
//   await t.expect(elementDOM.getAttribute('data-selector')).eql(selector);
// }


// export async function assertEmptyValidation() {
//   await t.expect(reportSection.find('[data-testid="report-empty"]').exists).ok();
//   await t.expect(reportSection.find('[data-testid="many-errors"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="error"]').exists).notOk();
// }

// export async function assertErrorValidation() {
//   await t.expect(reportSection.find('[data-testid="report-empty"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="many-errors"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="error"]').exists).ok();
// }

// export async function assertManyErrorsValidation() {
//   await t.expect(reportSection.find('[data-testid="report-empty"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="error"]').exists).notOk();
//   await t.expect(reportSection.find('[data-testid="many-errors"]').exists).ok();
// }


// export async function assertIsEnabledSettingCondition(setting) {
//   await t.expect(schemaSettingsSection.find(`[data-testid="settings-${setting}"]`).exists).ok();
// }

// export async function assertIsDisabledSettingCondition(setting) {
//   await t.expect(schemaSettingsSection.find(`[data-testid="settings-${setting}"]`).exists).notOk();
// }



// export async function assertSettingOptionsHasError(setting, value) {

//   const selector = schemaSettingsSection
//   .find(`[data-testid="settings-${setting}"]`)
//   .find('[data-testgroup="setting-options-error"]');

//   await t.expect(selector.exists).ok({ timeout: 1000 });
//   await t.expect(selector.innerText).eql(value);
// }
