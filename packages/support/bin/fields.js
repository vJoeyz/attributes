#!/usr/bin/env node
import {
  loadSchemas
} from './helper.js';

async function init() {

  const schemaAttributes = await loadSchemas();

  const schemaSettings = schemaAttributes.map(({ attribute, schema}) => {
    return {
      key: attribute.key,
      fields: schema && schema.fields || null
    }
  }).filter(({fields}) => fields !== null);

  console.log(JSON.stringify(schemaSettings));
  // console.log(schemaSettings);


  // const appliedTo = schemaSettings.map(({key, settings}) => {

  //   return settings && settings.map((setting) => {

  //     return setting && {
  //       key,
  //       setting: setting.key,
  //       appliedTo: setting.appliedTo
  //       } || null;
  //   }) || null;
  // }).flat().filter((applied) => applied !== null && (applied && applied.appliedTo && applied.appliedTo !== {}));

  // console.log(JSON.stringify(appliedTo));

}

init();
