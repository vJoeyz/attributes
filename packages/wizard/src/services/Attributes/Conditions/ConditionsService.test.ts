import conditionsService from './ConditionsService';

// import AttributeIsNotParentOfSelectorError from './IsParentOf/Errors/AttributeIsNotParentOfError';
import AttributeConditionalNotExistElementError from './Exists/Errors/ConditionalNotExistsError';
import AttributeConditionalSettingNotMatchElementError from './Settings/Errors/SettingNotMatchError';
import AttributeIsNotChildrenOfElementError from './IsChildOf/Errors/AttributeIsNotChildrenOfError';
import SchemaSelector from '@src/services/Selector/SchemaSelector';

//mocks
import { isChildOf } from './IsChildOf/IsChildOfService';
import { isParentOf } from './IsParentOf/isParentOfService';
import { exists } from './Exists/ExistsService';
import { hasSettings } from './Settings/SettingsService';
import type { AttributeElementSchema, AttributeSettingSchema } from '@global/types/schema'
import type { ItemError } from '@src/types/Error.types';
import CMS_LOAD from '@src/schemas/cms-load';

jest.mock('./Exists/ExistsService', () => ({
  exists: jest.fn(),
}));

jest.mock('./Settings/SettingsService', () => ({
  hasSettings: jest.fn(),
}));

jest.mock('./IsParentOf/isParentOfService', () => ({
  isParentOf: jest.fn(),
}));

jest.mock('./IsChildOf/IsChildOfService', () => {
  return {
    isChildOf: jest.fn(),
  };
});

const mockIsChildOf = isChildOf as jest.Mock;
const mockIsParentOf = isParentOf as jest.Mock;
const mockExists = exists as jest.Mock;
const mockhasSettings = hasSettings as jest.Mock;

describe('Test exists conditions', () => {

  const key = 'cmsload';

  beforeEach(() => {
    mockIsChildOf.mockClear();
    mockExists.mockClear();
  });

  test('Check condition that specificy standalone element must exist on page successful', () => {
    const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-element', 'items-count');

    const elementSchema = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'items-count');

    if (!elementSchema) {
      throw new Error('cms load - items count not found in schema');
    }

    const conditions = elementSchema.conditions;

    const instance = 1;
    const standalone = true;

    mockExists.mockReturnValue(true);

    const response = conditionsService(elementSelector, conditions, CMS_LOAD, {
      instance,
      standalone,
      key,
    });

    expect(response).toBe(true);

    expect(mockExists).toHaveBeenCalledTimes(1);
    expect(mockIsChildOf).toHaveBeenCalledTimes(0);
  });

  // test('Check condition that specific element not exist on page throw Error', () => {
  //   const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-element', 'items-count-4');
  //   const conditionSelector = new SchemaSelector('fs-cmsload-element', 'list-3');

  //   const elementSchema = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'items-count');

  //   if (!elementSchema) {
  //     throw new Error('cms load - items count not found in schema');
  //   }


  //   try {
  //     const conditions = elementSchema.conditions;


  //     const instance = 3;
  //     const standalone = false;

  //     mockExists.mockImplementation(() => {
  //       throw new AttributeConditionalNotExistElementError(elementSelector, conditionSelector);
  //     });

  //     conditionsService(elementSelector, conditions, CMS_LOAD, {
  //       instance,
  //       standalone,
  //       key,
  //     });

  //     expect(true).toBe(false);
  //   } catch (e) {
  //     const schemaError = e as ItemError;
  //     expect(schemaError).toBeInstanceOf(AttributeConditionalNotExistElementError);
  //     expect(mockExists).toHaveBeenCalledTimes(1);

  //   }
  // });
});

describe('Test isChildOf conditions', () => {

  const key = 'cmsload';

  beforeEach(() => {
    mockIsChildOf.mockClear();
  });

  test('Check element is child of css selector successful', () => {
    const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-element', 'page-button');


    const elementSchema = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'page-button');

    if (!elementSchema) {
      throw new Error('cms load - items count not found in schema');
    }

    const conditions = elementSchema.conditions;

    const instance = 1;
    const standalone = true;

    mockIsChildOf.mockReturnValue(true);

    const response = conditionsService(elementSelector, conditions, CMS_LOAD, {
      instance,
      standalone,
      key,
    });

    expect(response).toBe(true);
    expect(mockIsChildOf).toHaveBeenCalledTimes(1);
  });



  // test('Check element is child of another element throw Error', () => {
  //   const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-element', 'page-button');

  //   const elementSchema = CMS_LOAD.elements.find((element: AttributeElementSchema) => element.key === 'page-button');

  //   if (!elementSchema) {
  //     throw new Error('cms load - items count not found in schema');
  //   }

  //   const conditions = elementSchema.conditions;

  //   try {


  //     const instance = 2;
  //     const standalone = false;

  //     mockIsChildOf.mockImplementation(() => {
  //       throw new AttributeIsNotChildrenOfElementError(
  //         elementSelector,
  //         new SchemaSelector('fs-cmsload-element', 'list-2')
  //       );
  //     });

  //     conditionsService(elementSelector, conditions, CMS_LOAD, {
  //       instance,
  //       standalone,
  //       key,
  //     });

  //     expect(true).toBe(false);
  //   } catch (e) {
  //     const schemaError = e as ItemError;
  //     expect(schemaError).toBeInstanceOf(AttributeIsNotChildrenOfElementError);
  //     expect(mockIsChildOf).toHaveBeenCalledTimes(1);

  //   }
  // });

});



describe('Test settings conditions', () => {


  const key = 'cmsload';

  beforeEach(() => {
    mockhasSettings.mockClear();
  });

  test('Check condition that specificy element has correlation with another settings successfull', () => {
    const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-threshold', '-20');

    const elementSchema = CMS_LOAD.settings.find((element: AttributeSettingSchema) => element.key === 'threshold');

    if (!elementSchema) {
      throw new Error('cms load - threshold not found in schema');
    }

    const conditions = elementSchema.conditions;


    const instance = 1;
    const standalone = true;

    mockhasSettings.mockReturnValue(true);

    const response = conditionsService(elementSelector, conditions, CMS_LOAD, {
      instance,
      standalone,
      key,
    });

    expect(response).toBe(true);
    expect(mockhasSettings).toHaveBeenCalledTimes(1);


  });

  // test('Check condition 1 that specificy element has correlation with another settings throw Error', () => {
  //   const elementSelector: SchemaSelector = new SchemaSelector('fs-cmsload-threshold', '-20');

  //   const elementSchema = CMS_LOAD.settings.find((element: AttributeSettingSchema) => element.key === 'threshold');

  //   if (!elementSchema) {
  //     throw new Error('cms load - threshold not found in schema');
  //   }

  //   const instance = 1;
  //   const standalone = true;

  //   try {
  //     const conditions = elementSchema.conditions;

  //     mockhasSettings.mockImplementation(() => {
  //       throw new AttributeConditionalSettingNotMatchElementError(
  //         elementSelector,
  //         new SchemaSelector('fs-cmsload-element', 'list', true),
  //         new SchemaSelector('fs-cmsload-mode', 'infinite', false),
  //       );
  //     });

  //     conditionsService(elementSelector, conditions, CMS_LOAD, {
  //       instance,
  //       standalone,
  //       key,
  //     });
  //   } catch (e) {
  //     const schemaError = e as ItemError;
  //     expect(schemaError).toBeInstanceOf(AttributeConditionalSettingNotMatchElementError);

  //     expect(mockhasSettings).toHaveBeenCalledTimes(1);

  //   }
  // });

});
