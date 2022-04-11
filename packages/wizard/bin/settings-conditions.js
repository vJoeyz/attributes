#!/usr/bin/env node
import {
  loadSchemas
} from './helper.js';

async function init() {

  const schemaAttributes = await loadSchemas();

  const schemaSettings = schemaAttributes.map(({ attribute, schema}) => {
    return {
      key: attribute.key,
      settings: schema && schema.settings || null
    }
  });

  // console.log(schemaSettings);

  const conditions = schemaSettings.map(({ key, settings }) => {

    return settings && settings.map(setting => {
      return setting && {
        key,
        setting: setting.key,
        conditions: setting.conditions
       } || null;
    }) || null;
  }).flat().filter((condition) => condition !== null && (condition && condition.conditions && condition.conditions.length > 0));

  console.log(JSON.stringify(conditions));
}

init();
