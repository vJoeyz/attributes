// Import ESBuild
import esbuild from 'esbuild';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { writeFileSync } from 'fs';
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
  target: production ? 'es6' : 'esnext',
};

// Files building
esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/docs/index.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/docs.js`,
});

esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/changelog/index.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/changelog.js`,
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/attributes.ts'],
  outfile: 'temp/attributes.js',
  format: 'esm',
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/changesets.ts'],
  outfile: 'temp/changesets.js',
  format: 'esm',
});

/**
 * Attributes JSON generation
 */
import('../temp/attributes.js').then(({ attributesData }) => {
  writeFileSync(`${__dirname}/../attributes.json`, JSON.stringify(attributesData));
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
