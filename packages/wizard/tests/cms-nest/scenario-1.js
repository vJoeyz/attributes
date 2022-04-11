import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`CMS Nest`
    .page`http://localhost:9000/scenarios/cms-nest/scenario-1.html`;

test('CMS Nest - Validate instance 0-1', async t => {


  await selectAttribute('CMS Nest');
  await typeFieldIdentifier('field-collection-field-1', 'categories');

  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});
