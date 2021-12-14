import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  generateChangesetsJSON,
  generateExamplesJSON,
  generateScript,
  generateSchemaJSON,
} from '../../../../global/build.js';

dotenv.config({ path: '../../../.env' });

const __dirname = dirname(fileURLToPath(import.meta.url));

generateScript('src/index.ts', 'cmsselect');
generateExamplesJSON(__dirname);
generateSchemaJSON(__dirname);
generateChangesetsJSON(__dirname);
