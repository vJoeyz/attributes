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


fixture`Mirror Click`
    .page`http://localhost:9000/scenarios/mirror-click/scenario-1.html`;

test('Mirror Click - Default', async t => {
  await selectAttribute('Mirror click');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
