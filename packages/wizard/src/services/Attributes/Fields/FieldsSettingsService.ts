import {
  getSchemaItem,
  createSchemaSelectorFromItem,
  createSchemaSelectorFromSchema,
} from '@src/services/Attributes/Schema/SchemaService';
import { elementsSameNode } from '@src/services/Attributes/AppliedTo/AppliedToService';
import MissingFieldSettingError from './Errors/MissingFieldSettingError';
// import existsService from '@src/services/Attributes/Exists/ExistsService';
// import appliedToService from '@src/services/Attributes/AppliedTo/AppliedToService';
import conditionsService from '@src/services/Attributes/Conditions/ConditionsService';
import { valueServiceV2 } from '@src/services/Attributes/Values/ValuesService';
import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { AttributeSchema } from '@global/types/schema';
import type {
  SchemaInput,
  InputChannel,
  SchemaInputFieldSetting,
  SchemaInputField,
  InputValidationMessage
} from '@src/types/Input.types';
import type { SchemaSettings } from '@src/types/Schema.types';
import type { AttributeSettingSchema, SettingSpecialization } from '@global/types/schema';

export function validateFieldSetting(
  inputSetting: SchemaInputFieldSetting,
  field: InputChannel,
  schema: AttributeSchema,
  schemaSettings: SchemaSettings
): SchemaInput {


  const settingSchema = getSchemaItem(schema, 'settings', inputSetting.setting) as AttributeSettingSchema;
  const { conditions, value, specializations } = settingSchema;

  const instances = specializations && specializations.map((specialization: SettingSpecialization) => specialization.value)
    || [inputSetting.option];

  const validations = instances.map((option: string) => {

    const settingSelector = createSchemaSelectorFromItem(
      settingSchema,
      'settings',
      inputSetting.setting,
      schemaSettings,
      option
    );


    const fieldSelector = createSchemaSelectorFromSchema(
      schema,
      'fields',
      inputSetting.field,
      schemaSettings,
      (field.input as SchemaInputField).identifier,
    );


    try {

      const fieldSettingSelector = `${fieldSelector.getElementSelector()}${settingSelector.getAttributeSelector()}`;
      const elementsNode = document.querySelectorAll<HTMLElement>(fieldSettingSelector)

      const elements = Array.from(elementsNode);

      if (elements.length <= 0 || field.domElement === null) {
        throw new MissingFieldSettingError(settingSelector, fieldSelector);
      }

      if (field.domElement) {
        elementsSameNode(fieldSelector, elements, field.domElement)
      }

      if (conditions && conditions.length > 0) {
        conditionsService(settingSelector, conditions, schema, schemaSettings);
      }

      valueServiceV2(elements, settingSelector.getAttribute(), value, option, settingSelector);

      return null;
    } catch (error) {
      if (error instanceof AbstractSchemaError) {
        return {
          type: error.type,
          message: error.message,
        }
      } else {
        throw error;
      }
    }
  })

  const fieldErrors = validations.filter((fieldApplied) => fieldApplied && fieldApplied.message) as InputValidationMessage[];

  if (fieldErrors.length > 0) {
    return {
      ...inputSetting,
      validation: {
        status: false,
        messages: fieldErrors
      }

    }
  }

  return {
    ...inputSetting,
    validation: {
      status: true,
      messages: [
        {
          type: 'success',
          message: `Yup! Setting correctly setup.`,
        }
      ]
    }
  }
}
