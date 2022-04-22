import { validateElement } from './Elements/ElementsService';
import { validateElementSetting } from './Elements/ElementsSettingsService';
import { validateFieldSetting } from './Fields/FieldsSettingsService';
import { validateField } from './Fields/FieldsService';
import type { AttributeSchema } from '@global/types/schema';
import type { InputChannel, SchemaInput, SchemaInputElement, SchemaInputElementSetting, SchemaInputField, SchemaInputFieldSetting } from '@src/types/Input.types';

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

    const elementList: SchemaInputElement = {
      type: 'element',
      element: 'list',
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const elementPageButton: SchemaInputElement = {
      type: 'element',
      element: 'page-button',
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const form: SchemaInput[] = [
      elementList,
      elementPageButton,
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

  test('Validate elements with settings', async () => {

    const elementList: SchemaInputElement =  {
      type: 'element',
      element: 'list',
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const settingMode: SchemaInputElementSetting = {
      type: 'elementSetting',
      element: 'list',
      setting: 'mode',
      option: 'load-under',
      enable: true,
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const settingThreshold: SchemaInputElementSetting = {
      type: 'elementSetting',
      setting: 'threshold',
      option: '-20',
      element: 'list',
      enable: true,
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const form: SchemaInput[] = [
      elementList,
      settingMode,
      settingThreshold,
    ];


    const elementListChannel: InputChannel = {
      input: elementList,
      domElement: [],
    }


    validateElementMock.mockReturnValueOnce(elementListChannel);

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


    await validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).toHaveBeenCalled();

    expect(validateElementSettingMock).toHaveBeenCalled();

    expect(validateFieldMock).not.toHaveBeenCalled();
    expect(validateFieldSettingMock).not.toHaveBeenCalled();
  });


  test('Validate fields', async () => {

    const fieldName: SchemaInputField = {
      type: 'field',
      field: 'field',
      index: 'field-0',
      identifier: 'name',
      specialization: 'toggle-button',
      validation: null,
      instance: 1,
      key: 'cmsfilter',
    };

    const form: SchemaInput[] = [
      fieldName,
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

    const fieldNameChannel: InputChannel = {
      input: fieldName,
      domElement: [],
    }


    validateFieldMock.mockReturnValueOnce(fieldNameChannel);


    await validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).not.toHaveBeenCalled();

    expect(validateElementSettingMock).not.toHaveBeenCalled();
    expect(validateFieldSettingMock).not.toHaveBeenCalled();

    expect(validateFieldMock).toHaveBeenCalled();
  });


  test('Validate fields with settings', async () => {
    const fieldName: SchemaInputField = {
      type: 'field',
      field: 'field',
      index: 'field-0',
      identifier: 'name',
      specialization: 'toggle-button',
      instance: 1,
      key: 'cmsload',
      validation: null,
    };

    const settingActive: SchemaInputFieldSetting = {
      type: 'fieldSetting',
      field: 'field',
      index: 'field-0',
      setting: 'activeclass',
      option: 'my-class',
      enable: true,
      validation: null,
      instance: 1,
      key: 'cmsload',
    };

    const fieldNameChannel: InputChannel = {
      input: fieldName,
      domElement: [],
    }

    validateFieldMock.mockReturnValueOnce(fieldNameChannel);

    const form: SchemaInput[] = [
      fieldName,
      settingActive
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


    await validateInputForm(form, schema, schemaSettings);

    expect(validateElementMock).not.toHaveBeenCalled();

    expect(validateElementSettingMock).not.toHaveBeenCalled();

    expect(validateFieldSettingMock).toHaveBeenCalled();
    expect(validateFieldMock).toHaveBeenCalled();
  });


});
