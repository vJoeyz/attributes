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


fixture`Custom Select`
    .page`http://localhost:9000/scenarios/custom-select/scenario-1.html`;

test('Custom Select - Default', async t => {
  await selectAttribute('Custom Form Select');

  await selectItem('element-label');
  await selectItem('element-setting-hideinitial');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
