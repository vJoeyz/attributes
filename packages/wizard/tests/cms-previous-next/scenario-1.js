import {
  selectAttribute,
  selectItem,
  clickRunCheck,
  typeFieldIdentifier,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
} from './../helpers/assertions';


fixture`CMS Previous Next`
    .page`http://localhost:9000/scenarios/cms-previous-next/scenario-1.html`;

test('CMS Previous Next - Validate instance 0-1', async t => {


  await selectAttribute('CMS PrevNext');


  await selectItem('element-previous-empty');
  await selectItem('element-next-empty');


  await clickRunCheck();

  await assertErrorsCountOnReport(0);

});
