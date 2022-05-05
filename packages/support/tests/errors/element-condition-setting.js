import {
  selectAttribute,
  clickRunCheck,
  selectItem,
  selectSettingOption,
  clickToggleSelector,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Element Conditions Settings Errors`
    .page`http://localhost:9000/scenarios/errors/element-condition-setting.html`;

test('Element setting not match required element setting', async t => {

  await selectAttribute('CMS Load');


  await selectItem('element-setting-mode');
  await clickToggleSelector('element-setting-mode');

  await selectSettingOption('element-setting-mode', 'pagination');


  await selectItem('element-page-button');

  await clickRunCheck();

  await assertErrorsCountOnReport(2);
  await assertErrorIsOnReport('element-page-button', 'conditions-settings');
  await assertErrorIsOnAttribute('element-page-button', 'conditions-settings');

  await writeFileValidationMessage('Element attribute missing a required option attribute', 'element-page-button');
});
