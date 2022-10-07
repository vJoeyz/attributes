import { initialize, LDClient } from 'launchdarkly-js-client-sdk';

export const initializeUser = async (clientId: string): Promise<LDClient> => {
  const client: LDClient = initialize(clientId, { anonymous: true });
  await client.waitForInitialization();
  return client;
};
