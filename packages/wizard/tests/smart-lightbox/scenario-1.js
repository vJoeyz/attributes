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


fixture`Smart Lightbox`
    .page`http://localhost:9000/scenarios/smart-lightbox/scenario-1.html`;

test('Smart Lightbox - Default', async t => {
  await selectAttribute('Smart Lightbox');

  await selectItemAndInputSetting('element-setting-wait', '200');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
