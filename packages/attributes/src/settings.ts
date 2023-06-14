import { type AttributeSettings } from '@finsweet/attributes-utils';

/**
 * Parses the global settings added to a module element.
 * @param SETTINGS
 * @param module
 *
 * @returns An object with the global settings.
 */
export const parseAttributeGlobalSettings = (SETTINGS: AttributeSettings, module?: Element) => {
  if (!module) return {};

  const globalSettingsEntries = Object.entries(SETTINGS).reduce<[string, string | null][]>((acc, [, { key }]) => {
    const value = module.getAttribute(key);

    acc.push([key, value]);

    return acc;
  }, []);

  const globalSettings = Object.fromEntries(globalSettingsEntries);
  return globalSettings;
};
