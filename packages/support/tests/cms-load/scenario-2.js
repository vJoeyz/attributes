import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  selectItemAndSelectSetting,
  selectItemAndInputSetting,
  selectInstance,
  selectMultipleInstances,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertSuccess,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';


fixture`CMS Load - Default Attributes - Option`
    .page`http://localhost:9000/scenarios/cms-load/scenario-2.html`;

test('CMS Load - Validate default - without attribute - ok', async t => {

  await selectAttribute('CMS Load');

  await selectMultipleInstances(3);
  await selectInstance(1);

  await selectItem('element-setting-mode');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});

test('CMS Load - Validate default - with other attribute set - notOk', async t => {

  await selectAttribute('CMS Load');

  await selectMultipleInstances(3);
  await selectInstance(2);

  await selectItem('element-setting-mode');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);


  await assertErrorIsOnReport('element-setting-mode', 'setting-value-not-match');
  await assertErrorIsOnAttribute('element-setting-mode', 'setting-value-not-match');
});

test('CMS Load - Validate default - Not default value - ok', async t => {

  await selectAttribute('CMS Load');

  await selectMultipleInstances(3);
  await selectInstance(3);

  await selectItemAndSelectSetting('element-setting-mode', 'pagination');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});

test('CMS Load - Validate default - with attribute - ok', async t => {

  await selectAttribute('CMS Load');

  await selectMultipleInstances(4);
  await selectInstance(4);

  await selectItem('element-setting-mode');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
