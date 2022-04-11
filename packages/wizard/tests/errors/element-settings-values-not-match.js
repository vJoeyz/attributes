import {
  selectAttribute,
  clickRunCheck,
  selectItem,
  clickToggleSelector,
  typeSettingOption,
} from '../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from '../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Element Setting - Values`
    .page`http://localhost:9000/scenarios/errors/element-setting-values-not-match.html`;


test('Element Setting - Value not match', async t => {

  await selectAttribute('CMS Load');

  await selectItem('element-setting-duration');
  await clickToggleSelector('element-setting-duration');

  await typeSettingOption('element-setting-duration', '300');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('element-setting-duration', 'setting-value-not-match');
  await assertErrorIsOnAttribute('element-setting-duration', 'setting-value-not-match');

  await writeFileValidationMessage('Attribute setting not match value in html', 'element-setting-duration');
});
