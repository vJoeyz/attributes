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


fixture`Count Items`
    .page`http://localhost:9000/scenarios/count-items/scenario-1.html`;

test('Count Items - Default', async t => {
  await selectAttribute('List item counter');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
