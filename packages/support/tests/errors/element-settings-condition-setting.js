import {
  selectAttribute,
  clickRunCheck,
  selectItem,
  clickToggleSelector,
  selectSettingOption,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Element Setting Condition Setting`
    .page`http://localhost:9000/scenarios/errors/element-setting-condition-setting.html`;

test('Element setting not found required setting condition', async t => {

  await selectAttribute('CMS Load');


  await selectItem('element-setting-mode');
  await clickToggleSelector('element-setting-mode');

  await selectSettingOption('element-setting-mode', 'infinite');


  await selectItem('element-setting-threshold');


  await clickRunCheck();

  await assertErrorsCountOnReport(2);

  await assertErrorIsOnReport('element-setting-threshold', 'conditions-settings');
  await assertErrorIsOnAttribute('element-setting-threshold', 'conditions-settings');

  await writeFileValidationMessage('Option attribute missing a required option attribute', 'element-setting-threshold');
});
