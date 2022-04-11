import { validateElement } from './Elements/ElementsService';
import { validateElementSetting } from './Elements/ElementsSettingsService';
import { validateFieldSetting } from './Fields/FieldsSettingsService';
import { validateField } from './Fields/FieldsService';
import type { AttributeSchema } from '@src/global/types/schema';
import type { SchemaInput } from '@src/types/Input.types';

jest.mock('./Elements/ElementsService', () => ({
  validateElement: jest.fn(),
}));

jest.mock('./Elements/ElementsSettingsService', () => ({
  validateElementSetting: jest.fn(),
}));

jest.mock('./Fields/FieldsService', () => ({
  validateField: jest.fn(),
}));

jest.mock('./Fields/FieldsSettingsService', () => ({
  validateFieldSetting: jest.fn(),
}));


const validateElementMock = validateElement as jest.Mock;
const validateFieldMock = validateField as jest.Mock;
const validateElementSettingMock = validateElementSetting as jest.Mock;
const validateFieldSettingMock = validateFieldSetting as jest.Mock;


import { validateInputForm } from './AttributesService';

describe('Use Attributes Validation', () => {
  beforeEach(() => {
    (validateElementMock as jest.Mock).mockReset();
    (validateFieldMock as jest.Mock).mockReset();
    (validateElementSettingMock as jest.Mock).mockReset();
    (validateFieldSettingMock as jest.Mock).mockReset();
  });

  test('Validate elements', () => {
    const form: SchemaInput[] = [
      {
        type: 'element',
        element: 'list',
        validation: null,
        instance: 1,
        key: 'cmsload',
      },
      {
        type: 'element',
        element: 'page-button',
        validation: null,
        instance: 1,
        key: 'cmsload',
      },
    ];

    const schema: AttributeSchema = {
      elements: [],
      settings: [],
    };

    const key = 'cmsload';

    const standalone = false;

    const instance = 1;

    const schemaSettings = {
      key,
      standalone,
      instance,
    };

    validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).toHaveBeenCalled();
    expect(validateElementMock).toHaveBeenCalledTimes(2);

    expect(validateElementMock).toHaveBeenNthCalledWith(1, {
      ...form[0],
    }, schema, schemaSettings);

    expect(validateElementMock).toHaveBeenNthCalledWith(2, {
      ...form[1],
    }, schema, schemaSettings);

    expect(validateFieldMock).not.toHaveBeenCalled();
    expect(validateFieldSettingMock).not.toHaveBeenCalled();
    expect(validateElementSettingMock).not.toHaveBeenCalled();
  });

  test('Validate elements with settings', () => {
    const form: SchemaInput[] = [
      {
        type: 'element',
        element: 'list',
        validation: null,
        instance: 1,
        key: 'cmsload',
      },
      {
        type: 'elementSetting',
        element: 'list',
        setting: 'mode',
        option: 'load-under',
        enable: true,
        validation: null,
        instance: 1,
        key: 'cmsload',
      },
      {
        type: 'elementSetting',
        setting: 'threshold',
        option: '-20',
        element: 'list',
        enable: true,
        validation: null,
        instance: 1,
        key: 'cmsload',
      },
    ];

    const schema: AttributeSchema = {
      elements: [],
      settings: [],
    };

    const key = 'cmsload';

    const standalone = false;

    const instance = 1;

    const schemaSettings = {
      key,
      standalone,
      instance,
    };


    validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).toHaveBeenCalled();

    expect(validateElementSettingMock).toHaveBeenCalled();

    expect(validateFieldMock).not.toHaveBeenCalled();
    expect(validateFieldSettingMock).not.toHaveBeenCalled();
  });


  test('Validate fields', async () => {
    const form: SchemaInput[] = [
      {
        type: 'field',
        field: 'field',
        index: 'field-0',
        identifier: 'name',
        specialization: 'toggle-button',
        validation: null,
        instance: 1,
        key: 'cmsfilter',
      },
    ];

    const schema: AttributeSchema = {
      elements: [],
      settings: [],
    };

    const key = 'cmsfilter';

    const standalone = false;

    const instance = 1;

    const schemaSettings = {
      key,
      standalone,
      instance,
    };


    await validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).not.toHaveBeenCalled();

    expect(validateElementSettingMock).not.toHaveBeenCalled();
    expect(validateFieldSettingMock).not.toHaveBeenCalled();

    expect(validateFieldMock).toHaveBeenCalled();
  });


  test('Validate fields with settings', () => {
    const form: SchemaInput[] = [
      {
        type: 'field',
        field: 'field',
        index: 'field-0',
        identifier: 'name',
        specialization: 'toggle-button',
        instance: 1,
        key: 'cmsload',
        validation: null,
      },
      {
        type: 'fieldSetting',
        field: 'field',
        index: 'field-0',
        setting: 'activeclass',
        option: 'my-class',
        enable: true,
        validation: null,
        instance: 1,
        key: 'cmsload',
      }
    ];

    const schema: AttributeSchema = {
      elements: [],
      settings: [],
    };

    const key = 'cmsload';

    const standalone = false;

    const instance = 1;

    const schemaSettings = {
      key,
      standalone,
      instance,
    };


    validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).not.toHaveBeenCalled();

    expect(validateElementSettingMock).not.toHaveBeenCalled();

    expect(validateFieldSettingMock).toHaveBeenCalled();
    expect(validateFieldMock).toHaveBeenCalled();
  });


});
