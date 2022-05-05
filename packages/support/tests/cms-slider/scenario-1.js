import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`CMS Slider`
    .page`http://localhost:9000/scenarios/cms-slider/scenario-1.html`;

test('CMS Slider - Validate instance 0-1', async t => {
  await selectAttribute('CMS Slider');


  await selectItem('element-setting-resetix');
  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});
