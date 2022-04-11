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


fixture`Code Highlight`
    .page`http://localhost:9000/scenarios/code-highlight/scenario-1.html`;

test('Code Highlight - Default', async t => {
  await selectAttribute('Code Highlight');

  await selectItemAndInputSetting('element-setting-theme', 'custom-theme');

  await clickRunCheck();



  await assertErrorsCountOnReport(0);
});
