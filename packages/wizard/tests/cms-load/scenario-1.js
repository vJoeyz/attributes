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
} from './../helpers/assertions';


fixture`CMS Load`
    .page`http://localhost:9000/scenarios/cms-load/scenario-1.html`;

test('CMS Load - Validate instance 0/1 - Load under', async t => {


  await selectAttribute('CMS Load');

  await selectItemAndSelectSetting('element-setting-mode', 'load-under');


  await selectItemAndSelectSetting('element-setting-animation', 'slide-up');
  await selectItemAndSelectSetting('element-setting-easing', 'ease-out');
  await selectItemAndInputSetting('element-setting-duration', '2000');
  await selectItemAndInputSetting('element-setting-stagger', '100');
  await selectItem('element-setting-resetix');

  await selectItem('element-loader');
  await selectItem('element-items-count');
  await selectItem('element-visible-count')


  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});


test('CMS Load - Validate instance 2 - Pagination', async t => {


  await selectAttribute('CMS Load');


  await selectMultipleInstances(3);
  await selectInstance(2);

  await selectItemAndSelectSetting('element-setting-mode', 'pagination');

  await selectItemAndInputSetting('element-setting-pagesiblings', '1,2,3,4');
  await selectItemAndInputSetting('element-setting-pageboundary', '5,6,7,8');
  await selectItemAndInputSetting('element-setting-duration', '600');

  await selectItemAndSelectSetting('element-setting-animation', 'slide-down');
  await selectItemAndSelectSetting('element-setting-easing', 'ease-in');
  await selectItemAndInputSetting('element-setting-stagger', '300');
  await selectItem('element-setting-showquery');
  await selectItem('element-setting-resetix');

  await selectItem('element-loader');
  await selectItem('element-items-count');
  await selectItem('element-visible-count');
  await selectItem('element-scroll-anchor');
  await selectItem('element-page-button');
  await selectItem('element-page-dots');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});


test('CMS Load - Validate instance 3 - Render all', async t => {


  await selectAttribute('CMS Load');

  await selectMultipleInstances(3);
  await selectInstance(3);

  await selectItemAndSelectSetting('element-setting-mode', 'render-all');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);
});


test('CMS Load - Validate instance 4 - Infinite', async t => {


  await selectAttribute('CMS Load');

  await selectMultipleInstances(4);
  await selectInstance(4);

  await selectItemAndSelectSetting('element-setting-mode', 'infinite');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});
