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


fixture`Scroll Disable`
    .page`http://localhost:9000/scenarios/scroll-disable/scenario-1.html`;

test('Scroll Disable - Default', async t => {
  await selectAttribute('Disable scrolling');

  await selectItem('element-when-visible');
  await selectItem('element-smart-nav');
  await selectItem('element-preserve');

  await selectItem('element-setting-gap');
  await selectItemAndInputSetting('element-setting-media', '(max-width: 478px)');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
