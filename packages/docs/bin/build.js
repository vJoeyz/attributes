import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

import { defaultBuildSettings, generateChangesetsJSON, generateScript } from '../../../global/build.js';

dotenv.config({ path: '../../.env' });

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * Generates the `schema.json` API.
 * @param {string} __dirname
 */
const generateAttributesJSON = () => {
  esbuild.buildSync({
    ...defaultBuildSettings,
    entryPoints: ['api/attributes.ts'],
    outfile: `temp/attributes.js`,
    format: 'esm',
  });

  import(pathToFileURL(`${__dirname}/../temp/attributes.js`)).then(({ attributesData }) => {
    writeFileSync(`${__dirname}/../attributes.json`, JSON.stringify(attributesData));
  });
};

generateScript('src/docs/index.ts', 'docs');
generateScript('src/changelog/index.ts', 'changelog');
generateChangesetsJSON(__dirname);
generateAttributesJSON();
