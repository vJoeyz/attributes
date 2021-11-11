import { restartWebflow } from '@finsweet/ts-utils';

import type { WebflowModule } from '@finsweet/ts-utils';
import type { CMSItem } from '.';

/**
 * Restarts the required Webflow modules after rendering items to the DOM.
 *
 * @param totalItems The {@link CMSItem} instances of a `CMSList`.
 * @param renderedItems The `CMSItem` instances that have been rendered.
 * @param restartIx Defines if the Webflow `ix2` module must be restarted.
 * @param restartCommerce Defines if the Webflow `commerce` module must be restarted.
 * @returns An awaitable Promise.
 */
export const restartWebflowModules = async (
  totalItems: CMSItem[],
  renderedItems: CMSItem[],
  restartIx: boolean,
  restartCommerce: boolean
) => {
  if (!restartIx && !restartCommerce) return;

  const modulesToRestart: WebflowModule[] = [];

  if (restartIx && renderedItems.some(({ needsIx2Restart }) => needsIx2Restart)) modulesToRestart.push('ix2');

  if (restartCommerce && renderedItems.some(({ needsCommerceRestart }) => needsCommerceRestart)) {
    modulesToRestart.push('commerce');
  }

  if (modulesToRestart.length) {
    for (const item of totalItems) {
      const rendered = renderedItems.includes(item);

      if (restartIx) item.needsIx2Restart = !rendered;
      if (restartCommerce) item.needsCommerceRestart = !rendered;
    }
  }

  await restartWebflow(modulesToRestart);
};
