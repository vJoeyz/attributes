import { hasSettings } from './SettingsService';

import SettingNotMatchError from './Errors/SettingNotMatchError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';
import CMS_LOAD from '@src/schemas/cms-load';
import type { ItemError } from '@src/types/Error.types';
import type { AttributeElementSchema, AttributeSchemaCondition } from '@global/types/schema';

describe('Test if settings match', () => {

  test('Test schema element setting match', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="d-dyn-items" fs-cmsload-element="list" fs-cmsload-mode="pagination">

          </div>
          <a class="w-button" fs-cmsload-element="page-button"></a>
        </body>
      </html>
    `;

    const element = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'page-button');
    if (!element) {
      throw new Error('Missing conditions for page-button');
    }

    const conditions = element.conditions.filter((condition: AttributeSchemaCondition) => condition.condition === 'settings');

    const schemaSelector = new SchemaSelector('fs-cmsload-element', 'page-button', true);


    schemaSelector.setElements(Array.from(document.querySelectorAll('[fs-cmsload-element="page-button]')));

    const schemaSettings = {
      key: 'cmsload',
      instance: 1,
      standalone: false,
    }

    const result = hasSettings(schemaSelector, conditions, CMS_LOAD, schemaSettings);
    expect(result).toBe(true);
  });

  test('Test schema element not match setting', () => {
    global.document.documentElement.innerHTML = `
      <html>
        <body>
          <div class="d-dyn-items" fs-cmsload-element="list" fs-cmsload-mode="pagination">

          </div>
          <a class="w-button" fs-cmsload-element="page-button"></a>
        </body>
      </html>
    `;

    const element = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'page-button');
    if (!element) {
      throw new Error('Missing conditions for page-button');
    }

    const conditions = element.conditions.filter((condition: AttributeSchemaCondition) => condition.condition === 'settings');

    const schemaSelector = new SchemaSelector('fs-cmsload-element', 'page-button', true);


    schemaSelector.setElements(Array.from(document.querySelectorAll('[fs-cmsload-element="page-button"]')));

    const schemaSettings = {
      key: 'cmsload',
      instance: 1,
      standalone: false,
    }

    try {
      hasSettings(schemaSelector, conditions, CMS_LOAD, schemaSettings);
    } catch (e) {
      expect(e).toBeInstanceOf(SettingNotMatchError);
      expect((e as ItemError).type).toEqual('conditions-hasSettings');
    }
  });
})



// jest.mock('@src/services/DOM/Queries/QueriesService', () => {
//   return {
//     queryAttributeValue: jest.fn(),
//   };
// });

// const mockGetAttributeValue = queryAttributeValue as jest.Mock;

// describe('Test match setting', () => {
//   beforeEach(() => {
//     mockGetAttributeValue.mockReset();
//   });

//   const elementSelector = new SchemaSelector('fs-cmsload-threshold', '-20');

//   const conditionSelector = new SchemaSelector('fs-cmsload-element', 'list-5');

//   const settingSelector = new SchemaSelector('fs-cmsload-mode', 'infinite');

//   test('Setting match value in another element successful', () => {
//     mockGetAttributeValue.mockReturnValueOnce(settingSelector.getValue());

//     const response = isSettingMatch(elementSelector, conditionSelector, settingSelector);
//     expect(response).toBe(true);

//     expect(mockGetAttributeValue).toHaveBeenCalledTimes(1);
//     expect(mockGetAttributeValue).toHaveBeenCalledWith(
//       conditionSelector.getElementSelector(),
//       settingSelector.attribute
//     );
//   });

//   test('Setting do not match value in another element', () => {
//     mockGetAttributeValue.mockReturnValueOnce('');
//     try {
//       isSettingMatch(elementSelector, conditionSelector, settingSelector);
//       expect(true).toBe(false);
//     } catch (e) {
//       expect(e).toBeInstanceOf(SettingNotMatchElementError);
//     }
//   });
// });
