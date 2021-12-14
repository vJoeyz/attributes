import esbuild from 'esbuild';
import { writeFileSync, readFileSync } from 'fs';
import { pathToFileURL } from 'url';

const production = process.env.NODE_ENV === 'production';

/**
 * Default Settings
 * @type {esbuild.BuildOptions}
 */
export const defaultBuildSettings = {
  bundle: true,
  minify: production,
  sourcemap: false,
  target: production ? 'es6' : 'esnext',
};

/**
 * Generates the main script.
 * @param {string} entryPoint
 * @param {string} fileName
 */
export const generateScript = (entryPoint, fileName) => {
  esbuild.build({
    ...defaultBuildSettings,
    entryPoints: [entryPoint],
    outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/${fileName}.js`,
  });
};

/**
 * Generates the `examples.json` API.
 * @param {string} __dirname
 */
export const generateExamplesJSON = (__dirname) => {
  esbuild.buildSync({
    ...defaultBuildSettings,
    entryPoints: ['api/examples.ts'],
    outfile: `temp/examples.js`,
    format: 'esm',
  });

  import(pathToFileURL(`${__dirname}/../temp/examples.js`)).then(({ examples }) => {
    writeFileSync(`${__dirname}/../examples.json`, JSON.stringify(examples));
  });
};

/**
 * Generates the `schema.json` API.
 * @param {string} __dirname
 */
export const generateSchemaJSON = (__dirname) => {
  esbuild.buildSync({
    ...defaultBuildSettings,
    entryPoints: ['api/schema.ts'],
    outfile: `temp/schema.js`,
    format: 'esm',
  });

  import(pathToFileURL(`${__dirname}/../temp/schema.js`)).then(({ schema }) => {
    writeFileSync(`${__dirname}/../schema.json`, JSON.stringify(schema));
  });
};

/**
 * Generates the `changesets.json` API.
 * @param {string} __dirname
 */
export const generateChangesetsJSON = (__dirname) => {
  esbuild.buildSync({
    ...defaultBuildSettings,
    entryPoints: ['api/changesets.ts'],
    outfile: `temp/changesets.js`,
    format: 'esm',
  });

  import(pathToFileURL(`${__dirname}/../temp/changesets.js`)).then(({ changesets }) => {
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
};
