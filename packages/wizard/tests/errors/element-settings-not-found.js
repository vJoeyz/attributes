import {
  selectAttribute,
  clickRunCheck,
  selectItem,
  selectItemAndInputSetting,
  selectItemAndSelectSetting
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Element Setting not found errors`
    .page`http://localhost:9000/scenarios/errors/element-setting-not-found.html`;

test('Element setting not found in page', async t => {

  await selectAttribute('CMS Load');

  await selectItemAndSelectSetting('element-setting-animation', 'slide-up');


  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('element-setting-animation', 'attribute-not-found');
  await assertErrorIsOnAttribute('element-setting-animation', 'attribute-not-found');

  await writeFileValidationMessage('Option attribute not found', 'element-setting-animation');
});
