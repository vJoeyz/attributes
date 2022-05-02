import {
  selectAttribute,
  clickRunCheck,
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

fixture`Element Setting applied to errors`
    .page`http://localhost:9000/scenarios/errors/element-setting-applied-to-element.html`;

test('Element setting found but not applied to right element', async t => {

  await selectAttribute('CMS Load');

  await selectItemAndSelectSetting('element-setting-animation', 'slide-up');


  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('element-setting-animation', 'applied-to');
  await assertErrorIsOnAttribute('element-setting-animation', 'applied-to');

  await writeFileValidationMessage('Option attribute added to wrong element', 'element-setting-animation');
});
