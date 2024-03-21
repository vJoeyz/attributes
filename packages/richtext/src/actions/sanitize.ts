/**
 * Sanitizes an HTML string with `DOMPurify`.
 * @param rawHTML The HTML string to sanitize.
 */
export const sanitizeHTML = async (rawHTML: string): Promise<string> => {
  const DOMPurify = await import('dompurify');
  if (!DOMPurify) return '';

  return DOMPurify.sanitize(rawHTML);
};
