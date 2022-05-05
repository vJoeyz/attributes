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


fixture`CMS Tabs`
    .page`http://localhost:9000/scenarios/cms-tabs/scenario-1.html`;

test('CMS Tabs - Validate Instance 1', async t => {
  await selectAttribute('CMS Tabs');


  await selectItem('element-setting-resetix');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
