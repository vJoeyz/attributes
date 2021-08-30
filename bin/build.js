// Import ESBuild
import esbuild from 'esbuild';

/**
 * Default Settings
 * @type {esbuild.BuildOptions}
 */
const defaultSettings = {
  bundle: true,
  minify: true,
  sourcemap: false,
  // watch: true,
  outdir: 'dist',
  // outdir: '../../../Users/alexi/OneDrive/Espai de Treball/Finsweet/USWDS',
  target: 'es6',
};

// Files building
esbuild.buildSync({
  ...defaultSettings,
  entryPoints: ['src/a11y/index.ts', 'src/a11y/components/icons.ts', 'src/a11y/aria/aria-controls.ts'],
});
