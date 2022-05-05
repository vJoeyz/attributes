import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
  selectItemAndInputSetting,
  selectMultipleInstances,
  selectFieldSpecialization,
  selectInstance,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`Custom slider dots`
    .page`http://localhost:9000/scenarios/custom-slider-dots/scenario-1.html`;

test('Custom slider dots - Default', async t => {
  await selectAttribute('Custom slider dots');

  await selectItem('element-slider-nav');
  await selectItemAndInputSetting('element-setting-active', 'slider-active');
  await selectItem('element-setting-remove');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
