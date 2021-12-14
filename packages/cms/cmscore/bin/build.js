import { dirname } from 'path';
import { fileURLToPath } from 'url';

import { generateChangesetsJSON, generateScript } from '../../../../global/build.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

generateScript('src/index.ts', 'cmscore');
generateChangesetsJSON(__dirname);
