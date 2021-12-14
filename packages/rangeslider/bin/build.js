// Import ESBuild
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '../../.env' });

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
  target: 'es6',
};

// Files building
esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/index.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/rangeslider.js`,
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/examples.ts'],
  outfile: 'temp/examples.js',
  format: 'esm',
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/schema.ts'],
  outfile: 'temp/schema.js',
  format: 'esm',
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/changesets.ts'],
  outfile: 'temp/changesets.js',
  format: 'esm',
});

/**
 * Examples generation
 */
import('../temp/examples.js').then(({ examples }) => {
  writeFileSync(`${__dirname}/../examples.json`, JSON.stringify(examples));
});

/**
 * Schema generation
 */
import('../temp/schema.js').then(({ schema }) => {
  writeFileSync(`${__dirname}/../schema.json`, JSON.stringify(schema));
});

/**
 * Changeset JSON generation
 */
import('../temp/changesets.js').then(({ changesets }) => {
  const fullChangesets = changesets.map((changeset) => {
    const { version } = changeset;

    const markdown = readFileSync(`${__dirname}/../.changesets/${version}.md`, 'utf-8');
    if (!markdown) throw new Error(`File ${version}.md doesn't exist.`);

    return {
      ...changeset,
      markdown,
    };
  });

  writeFileSync(`${__dirname}/../changesets.json`, JSON.stringify(fullChangesets));
});
