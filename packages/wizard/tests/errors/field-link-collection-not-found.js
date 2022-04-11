import {
  selectAttribute,
  clickRunCheck,
  typeFieldIdentifier,
  selectFieldSpecialization,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Field - Link`
    .page`http://localhost:9000/scenarios/errors/field-link-collection-not-found.html`;

test('Field Link - Link - Field not found', async t => {

  await selectAttribute('CMS Nest');

  await typeFieldIdentifier('field-collection-field-1', 'categories');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-collection-field-1', 'field-not-found');
  await assertErrorIsOnAttribute('field-collection-field-1', 'field-not-found');

  await writeFileValidationMessage('CMS Nest - Link - Field not found', 'field-collection-field-1');
});
