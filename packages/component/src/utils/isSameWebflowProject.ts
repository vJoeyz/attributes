const baseURL = window.location.href;

export const isSameWebflowProject = async (
  url1: string | URL,
  url2: string | URL
): Promise<boolean | null | undefined> => {
  const parsedURL1 = new URL(url1, baseURL);
  const parsedURL2 = new URL(url2, baseURL);

  if (parsedURL1.hostname !== parsedURL2.hostname) {
    return false;
  }

  const response1 = await fetch(url1);
  const html1 = await response1.text();
  const doc1 = new DOMParser().parseFromString(html1, 'text/html');
  const element1 = doc1.querySelector('[data-wf-site]');
  if (!element1) return false;
  const siteAttribute1 = element1.getAttribute('data-wf-site');

  const response2 = await fetch(url2);
  const html2 = await response2.text();
  const doc2 = new DOMParser().parseFromString(html2, 'text/html');
  const element2 = doc2.querySelector('[data-wf-site]');
  if (!element2) return false;
  const siteAttribute2 = element2.getAttribute('data-wf-site');

  return siteAttribute1 === siteAttribute2;
};
