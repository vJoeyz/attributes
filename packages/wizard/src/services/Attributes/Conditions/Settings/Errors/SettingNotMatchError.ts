import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class SettingNotMatchElementError extends AbstractSchemaError {
  type = 'conditions-settings';

  constructor(
    attribute: SchemaSelector,
    condition: SchemaSelector,
    current: SchemaSelector,
    setting: SchemaSelector
  ) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());
    const conditionId = this.toAttribute(condition.getPrettierSelector());
    const currentId = this.toAttribute(current.getPrettierSelector());
    const settingId = this.toAttribute(setting.getPrettierSelector());


    this.message = [
      this.toHighlight(
        `The attribute ${attributeId} is missing the required settings ${settingId} in the ${conditionId}.`
      ),
      `Change ${currentId} to ${settingId}.`
    ].join(' ');

    Object.setPrototypeOf(this, SettingNotMatchElementError.prototype);
  }
}
