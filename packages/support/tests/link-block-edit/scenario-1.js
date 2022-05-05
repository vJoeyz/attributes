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


fixture`Link Block Edit`
    .page`http://localhost:9000/scenarios/link-block-edit/scenario-1.html`;

test('Link Block Edit - Default', async t => {
  await selectAttribute('Link blocks in editor');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
