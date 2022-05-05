import { t } from 'testcafe';
import {
  attributesDisplay,
  attributesOptions,
  // instancesSection,
  instancesInput,
  toggleInstances,
  instanceButtons,
  // instancesMoreButton,
  // selectInstanceSection,
  // schemaElementsSection,
  // schemaSettingsSection,
  // actionButton,
  // headerButton,
  runCheckBtn,
  resetBtn,
  getItemCheckbox,
  getItemToggle,
  getItemSelect,
  getItemSelectOptions,
  getItemInput,
  getFieldIdentifier,
  getFieldSpecialization,
  getFieldSpecializationOptions,
  getAttributeError,
  getAddFieldButton,
} from './pageObject';


export async function selectAttribute(title) {
  await t.click(attributesDisplay)
    .click(attributesOptions.withText(title));
}

export async function selectMultipleInstances(value) {

  await t.click(toggleInstances)
    .click(instancesInput)
    .pressKey('ctrl+a delete')
    .typeText(instancesInput, `${value}`, { paste: true });
}

export async function toggleMultipleInstances() {
  await t.click(toggleInstances);
}

export async function moreInstances() {

  await t.click(moreInstances);

}

export async function minusInstances() {
  await t.click(minusInstances);
}

export async function selectInstance(value) {
  await t.click(instanceButtons.withText(`${value}`));
}

export async function clickRunCheck() {
  await t.click(runCheckBtn);
}

export async function clickReset() {
  await t.click(resetBtn);
}


export async function selectItem(attributeId) {

  await t.click(getItemCheckbox(attributeId));
}

export async function clickToggleSelector(attributeId) {

  await t.click(getItemToggle(attributeId));

}

export async function selectItemAndInputSetting(attributeId, attributeValue) {
  await selectItem(attributeId);
  await clickToggleSelector(attributeId);
  await typeSettingOption(attributeId, attributeValue);
}

export async function selectItemAndSelectSetting(attributeId, attributeValue) {
  await selectItem(attributeId);
  await clickToggleSelector(attributeId);
  await selectSettingOption(attributeId, attributeValue);
}

export async function selectSettingOption(attributeId, value) {

  await t.click(getItemSelect(attributeId))
    .click(getItemSelectOptions(attributeId).withText(value));

}

export async function typeSettingOption(attributeId, value) {
  const input = getItemInput(attributeId);

  await t.click(input)
    .pressKey('ctrl+a delete')
    .typeText(input, `${value}`, { paste: true });
}

export async function typeFieldIdentifier(attributeId, value) {

  const identifier = getFieldIdentifier(attributeId);
  await t.click(identifier)
      .pressKey('ctrl+a delete')
    .typeText(identifier, `${value}`, { paste: true })
    .wait(250);
}

export async function selectFieldSpecialization(attributeId, value) {
  await t.click(getFieldSpecialization(attributeId))
  .click(getFieldSpecializationOptions(attributeId).withText(value));
}


export async function addField(index = 1) {
  await t.click(getAddFieldButton(index));
}

export async function getValidationMessage(attributeId, index = 1)  {
  const validationWrapper = await getAttributeError(attributeId, index);

  return {
    errorId: await validationWrapper.getAttribute('data-error'),
    errorMessage: await validationWrapper.innerText,
  }
}

export async function hoverSelector(attributeId) {

}





// export async function clickSetInstance(instance) {
//   await t.click(selectInstanceSection.find(`[data-id="${instance}"]`));
// }

// export async function clickHowManyInstances(instance) {
//   await t.click(instancesSection.find(`[data-id="${instance}"]`));
// }


// export async function clickSchemaElement(element) {
//   const selector = schemaElementsSection
//     .find(`[data-testid="elements-${element}"] input[type="checkbox"]`);
//   await t.click(selector);
// }

// export async function clickSchemaSetting(setting) {
//   const selector = schemaSettingsSection
//     .find(`[data-testid="settings-${setting}"] input[type="checkbox"]`);
//   await t.click(selector);
// }

// export async function selectSettingOption(setting, value) {
//   const selector = schemaSettingsSection
//     .find(`[data-testid="settings-${setting}"] select`);


//   const options = selector.find('option');

//   await t.click(selector)
//     .click(options.withText(value));
// }

// export async function clickSwitch(setting) {
//   const selector = schemaSettingsSection
//     .find(`[data-testid="settings-${setting}"] label.switch`);

//   await t.expect(selector.visible).ok().click(selector);
// }

// export async function typeSettingOption(setting, value) {
//   const selector = schemaSettingsSection
//   .find(`[data-testid="settings-${setting}"] input:not([type="checkbox"])`);


//   await t.click(selector)
//     .pressKey('ctrl+a delete')
//     .typeText(selector, value, { paste: true });
// }


// export async function clickMoreInstances() {
//   await t.click(instancesMoreButton);
// }


// export async function typeInstances(value) {
//   await t.click(instancesInput)
//     .pressKey('ctrl+a delete')
//     .typeText(instancesInput, value, { paste: true });
// }

// export async function clickSubmitActionValidation() {
//   await t.click(actionButton);
// }


// export async function clickSubmitHeaderValidation() {
//   await t.click(headerButton);
// }
