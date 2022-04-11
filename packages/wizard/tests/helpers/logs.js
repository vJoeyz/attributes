import path from 'path';
import fs from 'fs'
import { getValidationMessage } from './actions';

export async function writeFileValidationMessage(label, attributeId, index = 1) {


  const { errorId, errorMessage } = await getValidationMessage(attributeId, index);

  const currentPath = path.resolve(__dirname, '../', '../', 'bin', 'error-messages.json');

  let dataset = [];

  if (!fs.existsSync(currentPath)) {
    //dataset = {};
    fs.writeFileSync(currentPath, JSON.stringify(dataset));
  } else {

    const fileContents = fs.readFileSync(currentPath, 'utf-8');

    if (fileContents) {
      dataset = JSON.parse(fileContents);
    }
  }

  const entry = {
    label,
    errorId,
    errorMessage,
  }

  dataset.push(entry);


  fs.writeFileSync(currentPath, JSON.stringify(dataset));




//   const template = `
// - **${label}**. - Key "${errorId}"

//   - ${errorMessage}.

// ---

// `

//   fs.appendFileSync(currentPath, template);

}
