// Import ESBuild
import dotenv from 'dotenv';
import esbuild from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: '../../../.env' });

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
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/cmscore.js`,
  format: 'esm',
});

esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['api/changesets.ts'],
  outfile: 'temp/changesets.js',
  format: 'esm',
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
