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


fixture`CMS Sort`
    .page`http://localhost:9000/scenarios/cms-sort/scenario-1.html`;

test('CMS Sort - Validate select trigger - Instance 1', async t => {
  await selectAttribute('CMS Sort');

  await selectMultipleInstances(5);
  await selectInstance(1);

  await selectItemAndInputSetting('element-setting-duration', '200');

  await typeFieldIdentifier('field-field-field-1', 'sort-select');
  await selectFieldSpecialization('field-field-field-1', 'select-trigger');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});

test('CMS Sort - Validate button trigger - Instance 2', async t => {
  await selectAttribute('CMS Sort');

  await selectMultipleInstances(5);
  await selectInstance(2);

  await selectItemAndInputSetting('element-setting-duration', '300');

  await typeFieldIdentifier('field-field-field-1', 'sort-button');
  await selectFieldSpecialization('field-field-field-1', 'button-trigger');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});


test('CMS Sort - Validate dropdown trigger - Instance 3', async t => {
  await selectAttribute('CMS Sort');

  await selectMultipleInstances(5);
  await selectInstance(3);

  await typeFieldIdentifier('field-field-field-1', 'sort-dropdown');
  await selectFieldSpecialization('field-field-field-1', 'dropdown-trigger');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
