// Import ESBuild
import esbuild from 'esbuild';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Default Settings
 * @type {esbuild.BuildOptions}
 */
const defaultSettings = {
  bundle: true,
  minify: true,
  sourcemap: false,
  target: 'es6',
};

// Files building
esbuild.build({
  ...defaultSettings,
  entryPoints: ['src/index.ts'],
  outfile: `${process.env.CUSTOM_BUILD_DIRECTORY || ''}/components.js`,
});
