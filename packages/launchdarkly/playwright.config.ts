import { config } from '../../global/tests/index.js';

export default {
  ...config,
  webServer: {
    ...config.webServer,
    reuseExistingServer: true,
  },
};
