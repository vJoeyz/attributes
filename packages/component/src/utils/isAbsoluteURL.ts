export const isAbsoluteURL = (url: string): boolean => {
  try {
    const parsedURL = new URL(url);
    return !!parsedURL.protocol;
  } catch (e) {
    return false;
  }
};
