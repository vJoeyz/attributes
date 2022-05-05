import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
  selectItemAndInputSetting,
  selectMultipleInstances,
  selectFieldSpecialization,
  selectInstance,
  addField,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`Rich Text`
    .page`http://localhost:9000/scenarios/rich-text/scenario-1.html`;

test('Rich Text - Default', async t => {
  await selectAttribute('Powerful Rich Text');


  await selectItem('element-setting-sanitize');
  await selectItem('element-setting-resetix');

  await typeFieldIdentifier('field-component-field-1', 'page-component');


  await addField();
  await typeFieldIdentifier('field-component-field-2', 'external-component=/scenarios/rich-text/component.html');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});
