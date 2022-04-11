import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
  selectItemAndInputSetting,
  selectMultipleInstances,
  selectFieldSpecialization,
  selectInstance,
  selectItemAndSelectSetting,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`Range Slider`
    .page`http://localhost:9000/scenarios/range-slider/scenario-1.html`;

test('Range Slider - Default', async t => {
  await selectAttribute('Range Slider');

  await selectItemAndInputSetting('element-setting-min', '0');
  await selectItemAndInputSetting('element-setting-max', '1000');
  await selectItemAndInputSetting('element-setting-step', '20');
  await selectItem('element-setting-formatdisplay');
  await selectItemAndSelectSetting('element-setting-update', 'release');

  await selectItemAndInputSetting('element-setting-start', '500');

  await selectItem('element-display-value');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
