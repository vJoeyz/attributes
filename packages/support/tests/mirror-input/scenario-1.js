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


fixture`Mirror Input`
    .page`http://localhost:9000/scenarios/mirror-input/scenario-1.html`;

test('Mirror Input - Default', async t => {
  await selectAttribute('Mirror input values');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
