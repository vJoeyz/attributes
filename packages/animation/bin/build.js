// Import ESBuild
import dotenv from 'dotenv';
import esbuild from 'esbuild';

dotenv.config({ path: '../../.env' });

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
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/animation.js`,
});

esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/functions.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/functions.js`,
  format: 'esm',
});
