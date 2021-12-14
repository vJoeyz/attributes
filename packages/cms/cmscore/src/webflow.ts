import { restartWebflow } from '@finsweet/ts-utils';
import type { WebflowModule } from '@finsweet/ts-utils';

import type { CMSItem, CMSList } from '.';

/**
 * Restarts the required Webflow modules after rendering items to the DOM.
 *
 * @param renderedItems The `CMSItem` instances that have been rendered.
 * @param listInstance The {@link CMSList} instance.
 *
 * @returns An awaitable Promise.
 */
export const restartWebflowModules = async (
  renderedItems: CMSItem[],
  { items, restartWebflow: mustRestartWebflow, restartIx, restartCommerce, restartLightbox }: CMSList
) => {
  if (!mustRestartWebflow && !restartIx && !restartCommerce && !restartLightbox) return;
  if (!renderedItems.some(({ needsWebflowRestart }) => needsWebflowRestart)) return;

  for (const item of items) {
    const rendered = renderedItems.includes(item);

    item.needsWebflowRestart = !rendered;
  }

  if (mustRestartWebflow) {
    await restartWebflow();
    return;
  }

  const modulesToRestart: WebflowModule[] = [];

  if (restartIx) modulesToRestart.push('ix2');
  if (restartCommerce) modulesToRestart.push('commerce');
  if (restartLightbox) modulesToRestart.push('lightbox');

  await restartWebflow(modulesToRestart);
};
