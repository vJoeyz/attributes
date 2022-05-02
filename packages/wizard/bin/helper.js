import fetch from 'node-fetch';

export async function loadAttributes() {
  const request = await fetch('https://cdn.jsdelivr.net/npm/@finsweet/attributes-docs@1/attributes.json');
  const data = await request.json();

  const attributesWithLoadPromises = data.map(async (attribute) => {
    const schemaFile = `${attribute.baseSrc}/${attribute.schemaSrc}`;
    const scriptFile = `${attribute.baseSrc}/${attribute.scriptSrc}`;


    return {
      ...attribute,
      schemaFile,
      scriptFile,
    };
  })

  const attributesWithLoad = await Promise.all(attributesWithLoadPromises);

  return attributesWithLoad;

}

export async function loadAttributeSchema(scriptFile) {

  try {
    const request = await fetch(scriptFile);

    const payload = await request.json();

    return payload;
  } catch {
    return null;
  }
}


export async function loadSchemas() {
  const attributes = await loadAttributes();


  const schemaAttributesPromises = attributes.map(async function(attr) {

    const schema = await loadAttributeSchema(attr.schemaFile);

    return {
      attribute: attr,
      schema,
    };
  });

  const schemaAttributes = await Promise.all(schemaAttributesPromises);
  return schemaAttributes;
}
