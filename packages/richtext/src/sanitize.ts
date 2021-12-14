/// <reference types="@types/dompurify" />
import { Debug } from '@finsweet/ts-utils';

const DOMPURIFY_SRC = 'https://cdn.jsdelivr.net/npm/dompurify@2/dist/purify.es.min.js';

let DOMPurify: DOMPurify.DOMPurifyI | undefined;

/**
 * Dynamically imports `DOMPurify` and memoizes the library.
 */
const importDOMPurify = async (): Promise<DOMPurify.DOMPurifyI | undefined> => {
  if (DOMPurify) return DOMPurify;

  try {
    const module: { default: DOMPurify.DOMPurifyI } = await import(DOMPURIFY_SRC);

    DOMPurify = module.default;

    return DOMPurify;
  } catch (error) {
    Debug.alert('There was an issue while importing DOMPurify.', 'info');
    return;
  }
};

/**
 * Sanitizes an HTML string with `DOMPurify`.
 * @param rawHTML The HTML string to sanitize.
 */
export const sanitizeHTML = async (rawHTML: string): Promise<string> => {
  const DOMPurify = await importDOMPurify();
  if (!DOMPurify) return '';

  return DOMPurify.sanitize(rawHTML);
};
