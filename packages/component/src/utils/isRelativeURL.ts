const ABSOLUTE_URL_REGEXP = /^(?!(?:[a-z]+:)?\/\/)/i;

export const isRelativeURL = (url: string): boolean | undefined => {
  try {
    return ABSOLUTE_URL_REGEXP.test(url);
  } catch (error) {
    return false;
  }
};
