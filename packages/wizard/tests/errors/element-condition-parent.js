import {
  selectAttribute,
  clickRunCheck,
  selectItem,
  selectSettingOption,
  clickToggleSelector,
} from './../helpers/actions';
import {
  assertErrorsCountOnReport,
  assertErrorIsOnReport,
  assertErrorIsOnAttribute,
} from './../helpers/assertions';
import {
  writeFileValidationMessage
} from './../helpers/logs';

fixture`Element Conditions ChildOf Errors`
    .page`http://localhost:9000/scenarios/errors/element-condition-parent.html`;

test('Element not child of selector', async t => {

  await selectAttribute('Custom Form Select');

  await clickRunCheck();

  await assertErrorsCountOnReport(1);
  await assertErrorIsOnReport('element-dropdown', 'conditions-isParentOf');
  await assertErrorIsOnAttribute('element-dropdown', 'conditions-isParentOf');

  await writeFileValidationMessage('Attribute element condition isParentOf not match', 'element-dropdown');
});
