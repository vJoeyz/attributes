import { fetchPageDocument } from '@finsweet/attributes-utils';

import { getAttribute } from '../utils/selectors';
import type { ComponentTargetData } from '../utils/types';

const componentsPages: Map<string, Promise<Document | null>> = new Map();

/**
 * Prefetches the pages of the components.
 * This is a hack to work around all components being initted in parallel and not hitting the cache.
 * The {@link fetchPageDocument} helper already caches the pages in memory and in an IndexedDB instance,
 * but when initting all components in parallel, it doesn't have enough time to cache them
 * before other components try to fetch the same resource.
 * So with this trick we filter and prefetch all the pages before initting the components.
 *
 * @param componentsData
 */
export const prefetchComponentsPages = (componentTargetsData: ComponentTargetData[]) => {
  const cache = getAttribute(null, 'cache') !== 'false';
  const cacheKey = getAttribute(null, 'cachekey');
  const cacheVersion = getAttribute(null, 'cacheversion') ?? 1;

  for (const { proxiedSource, source } of componentTargetsData) {
    const href = proxiedSource?.href || source.href;
    if (componentsPages.has(href)) continue;

    const promise = fetchPageDocument(href, {
      cache,
      cacheKey,
      cacheExternal: cache,
      cacheVersion,
    });

    componentsPages.set(href, promise);
  }
};

/**
 * @returns A prefetched component page.
 * @param source The source URL of the component.
 */
export const getComponentPage = (source: URL) => componentsPages.get(source.href);
