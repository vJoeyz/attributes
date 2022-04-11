import { queryElement } from '@src/services/DOM/Queries/QueriesService';

function createSrcSelector(scriptSrc: string): string {
  return `script[src="${scriptSrc}"]`;
}

export function isScriptLoaded(scriptSrc: string): boolean {
  const selector = createSrcSelector(scriptSrc);

  try {
    queryElement(selector);
    return true;
  } catch (e) {
    return false;
  }
}
