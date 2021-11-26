// Import ESBuild
import esbuild from 'esbuild';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { schema } from '../schema.js';

dotenv.config({ path: '../../../.env' });

const __dirname = dirname(fileURLToPath(import.meta.url));

const production = process.env.NODE_ENV === 'production';

/**
 * Default Settings
 * @type {esbuild.BuildOptions}
 */
const defaultSettings = {
  bundle: true,
  minify: production,
  sourcemap: false,
  target: production ? 'es6' : 'esnext',
};

// Files building
esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/index.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/cmsload.js`,
});

esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/schema.ts'],
  outfile: 'schema.js',
  format: 'esm',
});

/**
 * Schema generation
 */
writeFileSync(`${__dirname}/../schema.json`, JSON.stringify(schema));
