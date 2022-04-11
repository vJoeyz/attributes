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

fixture`Field - Applied wrong selector`
    .page`http://localhost:9000/scenarios/errors/field-selector.html`;

test('Field found in wrong element selector', async t => {

  await selectAttribute('CMS Filter');

  await typeFieldIdentifier('field-field-field-1', 'element-selector');
  await selectFieldSpecialization('field-field-field-1', 'checkbox');


  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-field-field-1', 'field-selector');
  await assertErrorIsOnAttribute('field-field-field-1', 'field-selector');

  await writeFileValidationMessage('Field - Added in wrong html element', 'field-field-field-1');
});


test('Field found in wrong element selector with class', async t => {

  await selectAttribute('CMS Filter');

  await typeFieldIdentifier('field-field-field-1', 'element-class-selector');
  await selectFieldSpecialization('field-field-field-1', 'toggle-button');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-field-field-1', 'field-selector');
  await assertErrorIsOnAttribute('field-field-field-1', 'field-selector');

  await writeFileValidationMessage('Field - Added in wrong html element by class', 'field-field-field-1');
});


test('Field found in wrong element selector with type', async t => {

  await selectAttribute('CMS Filter');

  await typeFieldIdentifier('field-field-field-1', 'element-type-selector');
  await selectFieldSpecialization('field-field-field-1', 'toggle-button');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-field-field-1', 'field-selector');
  await assertErrorIsOnAttribute('field-field-field-1', 'field-selector');

  await writeFileValidationMessage('Field - Added in wrong html element by type', 'field-field-field-1');
});
