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
  minify: true,
  sourcemap: false,
  target: production ? 'es6' : 'esnext',
};

// Files building
esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/index.ts'],
  outfile: `${production ? '' : process.env.CUSTOM_BUILD_DIRECTORY || ''}/components.js`,
});
