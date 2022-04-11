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

fixture`Field - Component`
    .page`http://localhost:9000/scenarios/errors/field-component.html`;

test('Field missing component on current page', async t => {

  await selectAttribute('Powerful Rich Text');

  await typeFieldIdentifier('field-component-field-1', 'my-internal-component');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-component-field-1', 'field-not-found');
  await assertErrorIsOnAttribute('field-component-field-1', 'field-not-found');

  await writeFileValidationMessage('Rich Text - Component not found in current page', 'field-component-field-1');
});

test('Field link to another page not find page', async t => {

  await selectAttribute('Powerful Rich Text');

  await typeFieldIdentifier('field-component-field-1', 'my-external-component="/scenarios/errors/random.html"');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-component-field-1', 'field-component-type-link-not-working');
  await assertErrorIsOnAttribute('field-component-field-1', 'field-component-type-link-not-working');

  await writeFileValidationMessage('Rich Text - Link to component in another page not working', 'field-component-field-1');
});


test('Field - Component in external page not found', async t => {
  await selectAttribute('Powerful Rich Text');

  await typeFieldIdentifier('field-component-field-1', 'my-external-component="http://localhost:9000/scenarios/errors/field-external-component.html"');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);

  await assertErrorIsOnReport('field-component-field-1', 'field-component-type-missing-external-component');
  await assertErrorIsOnAttribute('field-component-field-1', 'field-component-type-missing-external-component');

  await writeFileValidationMessage('Rich Text - Component not found in external page', 'field-component-field-1');
})
