import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
  clickToggleSelector,
  selectSettingOption,
  typeSettingOption,
  selectFieldSpecialization,
  addField,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertSuccess,
} from './../helpers/assertions';


fixture`CMS Filter`
    .page`http://localhost:9000/scenarios/cms-filter/scenario-1.html`;

test('CMS Filter - Validate instance 0-1', async t => {


  await selectAttribute('CMS Filter');

  // settings for list
  await selectItem('element-setting-active');
  await clickToggleSelector('element-setting-active');
  await typeSettingOption('element-setting-active', 'active-class');

  await selectItem('element-setting-showquery');
  await clickToggleSelector('element-setting-showquery');

  await selectItem('element-setting-tagformat');
  //await clickToggleSelector('element-setting-tagformat');
  //await typeSettingOption('element-setting-active', 'active-class');

  await selectItem('element-setting-debounce');
  await clickToggleSelector('element-setting-debounce');
  await typeSettingOption('element-setting-debounce', '250')
  // await typeFieldIdentifier('element-setting-active', 'active-class');

  await selectItem('element-setting-highlightclass');
  await clickToggleSelector('element-setting-highlightclass');
  await typeSettingOption('element-setting-highlightclass', 'highlight-class')


  await selectItem('element-setting-easing');
  await clickToggleSelector('element-setting-easing');
  await selectSettingOption('element-setting-easing', 'ease-out');

  await selectItem('element-setting-duration');
  await clickToggleSelector('element-setting-duration');
  await typeSettingOption('element-setting-duration', '500');


  // add checkbox
  await typeFieldIdentifier('field-field-field-1', 'element-checkbox');
  await clickToggleSelector('element-setting-active');
  await selectFieldSpecialization('field-field-field-1', 'checkbox');

  // add radio

  await addField();
  await typeFieldIdentifier('field-field-field-2', 'element-radio');
  await selectFieldSpecialization('field-field-field-2', 'radio');

  // add toggle

  await addField();
  await typeFieldIdentifier('field-field-field-3', 'element-toggle');
  await selectFieldSpecialization('field-field-field-3', 'toggle-button');

  // add search field

  await addField();
  await typeFieldIdentifier('field-field-field-4', 'element-select, element-checkbox, element-radio');
  await selectFieldSpecialization('field-field-field-4', 'search-field');

  // add select

  await addField();
  await typeFieldIdentifier('field-field-field-5', 'element-select');
  await selectFieldSpecialization('field-field-field-5', 'select');


  // select all elements
  await selectItem('element-results-count');
  await selectItem('element-items-count');
  await selectItem('element-empty');
  await selectItem('element-initial');
  await selectItem('element-tag-template');
  await selectItem('element-tag-text');
  await selectItem('element-tag-remove');
  await selectItem('element-scroll-anchor');

  await selectItem('element-reset');

  await selectItem('element-setting-reset');
  await clickToggleSelector('element-setting-reset');
  await typeSettingOption('element-setting-reset', 'element-radio, element-checkbox')

  await clickRunCheck();

  await assertErrorsCountOnReport(0);

  // await assertSuccess('element-list');
  // await assertSuccess('element-items-count');
});
