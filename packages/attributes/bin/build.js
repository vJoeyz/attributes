/* eslint-disable no-console */
import * as esbuild from 'esbuild';
import { readdirSync, unlinkSync } from 'fs';
import { join } from 'path';


// Config output
const BUILD_DIRECTORY = './dist';
const PRODUCTION = process.env.NODE_ENV === 'production';

// Config entrypoint files
const ENTRY_POINTS = ['src/index.ts'];

// Config dev serving
const LIVE_RELOAD = !PRODUCTION;
const SERVE_PORT = 3000;

/**
 * @type {esbuild.BuildOptions}
 */
const buildOptions = {
  bundle: true,
  entryPoints: ENTRY_POINTS,
  minify: PRODUCTION,
  sourcemap: !PRODUCTION,
  target: PRODUCTION ? 'es2019' : 'esnext',
  define: {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    SERVE_PORT: JSON.stringify(SERVE_PORT),
  },
};

// Create contexts
const context = await esbuild.context({
  ...buildOptions,
  outdir: BUILD_DIRECTORY,
  inject: LIVE_RELOAD ? ['./bin/live-reload.js'] : undefined,
  format: 'esm',
  splitting: true,
});

// Remove old output files
try {
  readdirSync(BUILD_DIRECTORY).map((file) => unlinkSync(join(BUILD_DIRECTORY, file)));
} catch (err) {}

// Build files in prod
if (PRODUCTION) {
  await context.rebuild();
  context.dispose();
}

// Watch and serve files in dev
else {
  await context.watch();
  await context
    .serve({
      servedir: '.',
      port: SERVE_PORT,
    })
    .then(({ port }) => {
      console.log(`Serving files at http://localhost:${port}`);
    });
}
