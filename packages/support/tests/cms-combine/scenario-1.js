import {
  selectAttribute,
  selectItem,
  clickRunCheck,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertSuccess,
} from './../helpers/assertions';


fixture`CMS Combine`
    .page`http://localhost:9000/scenarios/cms-combine/scenario-1.html`;

test('CMS Combine - Validate instance 0-1', async t => {


  await selectAttribute('CMS Combine');

  await selectItem('element-items-count');
  await clickRunCheck();

  await assertErrorsCountOnReport(0);

  await assertSuccess('element-list');
  await assertSuccess('element-items-count');
});
