export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: 'fullscreen',
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

// .storybook/preview.js

import Layout from './../src/components/Layout/Layout.svelte';

export const decorators = [() => Layout];
