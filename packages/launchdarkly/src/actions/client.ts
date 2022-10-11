import { initialize, LDClient } from 'launchdarkly-js-client-sdk';

/**
 * Initializes the Launch Darkly client.
 * @param clientId
 */
export const initializeClient = async (clientId: string): Promise<LDClient> => {
  const client = initialize(clientId, { anonymous: true });
  await client.waitForInitialization();
  return client;
};
