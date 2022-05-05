import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`CMS Select`
    .page`http://localhost:9000/scenarios/cms-select/scenario-1.html`;

test('CMS Select - Validate instance 0-1', async t => {
  await selectAttribute('CMS Select');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});
