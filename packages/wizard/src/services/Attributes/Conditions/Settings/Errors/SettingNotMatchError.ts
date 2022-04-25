import AbstractSchemaError from '@src/services/Errors/AbstractSchemaError';
import type { SchemaSelector } from '@src/types/Schema.types';

export default class SettingNotMatchError extends AbstractSchemaError {
  type = 'conditions-settings';

  constructor(
    attribute: SchemaSelector,
    current: SchemaSelector,
    setting: SchemaSelector
  ) {
    super();

    const attributeId = this.toAttribute(attribute.getPrettierSelector());
    const currentId = this.toAttribute(current.getPrettierSelector());
    const settingId = this.toAttribute(setting.getPrettierSelector());


    this.message = [
      this.toHighlight(
        `The attribute ${attributeId} is used, but missing a required option attribute that supports it.`
      ),
      `Change ${currentId} to ${settingId}.`
    ].join(' ');

    Object.setPrototypeOf(this, SettingNotMatchError.prototype);
  }
}
