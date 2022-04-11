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

fixture`Element Conditions Exists Errors`
    .page`http://localhost:9000/scenarios/errors/element-condition-exists.html`;

test('Element condition not found in page', async t => {

  await selectAttribute('CMS Load');


  await selectItem('element-loader');

  await clickRunCheck();

  await assertErrorsCountOnReport(2);
  await assertErrorIsOnReport('element-loader', 'conditions-exists');
  await assertErrorIsOnAttribute('element-loader', 'conditions-exists');

  await writeFileValidationMessage('Attribute element condition exist not match', 'element-loader');
});
