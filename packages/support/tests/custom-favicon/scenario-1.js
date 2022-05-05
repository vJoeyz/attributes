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


fixture`Custom Favicon`
    .page`http://localhost:9000/scenarios/custom-favicon/scenario-1.html`;

test('Custom Favicon - Default', async t => {
  await selectAttribute('Custom favicon by page');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
