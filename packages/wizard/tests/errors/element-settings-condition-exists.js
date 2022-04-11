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

fixture`Element Setting Condition Exists`
    .page`http://localhost:9000/scenarios/errors/element-setting-condition-exists.html`;

test('Element setting not found required exists condition', async t => {

  await selectAttribute('Mirror click events');


  await selectItem('element-setting-delay');


  await clickRunCheck();

  await assertErrorsCountOnReport(2);

  await assertErrorIsOnReport('element-setting-delay', 'conditions-exists');
  await assertErrorIsOnAttribute('element-setting-delay', 'conditions-exists');

  await writeFileValidationMessage('Attribute setting condition exists not match', 'element-setting-delay');
});
