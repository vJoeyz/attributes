import { getPublishDate, getSiteId } from '@finsweet/ts-utils';

const DB_OBJECT_STORE_NAME = 'pages';
const memoryCache = new Map<string, Promise<string>>();

/**
 * Fetches and parses an external page.
 * Stores the page response in a {@link IDBDatabase} if the page belongs to the same site.
 *
 * @param href The URL of the page.
 *
 * @returns The page's {@link Document} if successful, `null` otherwise.
 */
export const fetchPageDocument = async (href: string) => {
  try {
    const url = new URL(href, window.location.origin);

    // Try to create a DB instance.
    const siteId = getSiteId();
    const publishDate = getPublishDate();
    const db = siteId && publishDate ? await createCacheDB(siteId, publishDate) : null;

    // If the same page is being fetched simultaneously, get it from the memory cache.
    let rawPagePromise = memoryCache.get(url.href);
    if (rawPagePromise) return parseRawPage(await rawPagePromise);

    // If the page is in the DB, get it from there.
    let rawPage = db ? await getPageFromDB(db, url.href) : null;
    if (rawPage) return parseRawPage(rawPage);

    // Get the raw page promise and store it in the memory cache.
    rawPagePromise = fetchRawPage(url.href);

    memoryCache.set(url.href, rawPagePromise);

    // Get the page.
    rawPage = await rawPagePromise;

    const page = parseRawPage(rawPage);
    const fetchedSiteId = getSiteId(page);

    // If the page belongs to the same site, store it in the DB.
    if (db && fetchedSiteId && fetchedSiteId === siteId) {
      await storePageInDB(db, url.href, rawPage);
      memoryCache.delete(url.href);
    }

    return page;
  } catch (err) {
    return null;
  }
};

/**
 * Fetches a page and returns the HTML text.
 * @param href
 */
const fetchRawPage = async (href: string) => {
  const response = await fetch(href);
  return response.text();
};

/**
 * Parses a raw page's HTML text into a {@link Document}.
 * @param rawPage
 */
const parseRawPage = (rawPage: string) => new DOMParser().parseFromString(rawPage, 'text/html');

/**
 * Creates a DB instance.
 * @param siteId
 * @param publishDate
 * @returns An {@link IDBDatabase} instance.
 */
const createCacheDB = (siteId: string, publishDate: Date) => {
  try {
    const dbOpenRequest = window.indexedDB.open(siteId, publishDate.getTime());

    dbOpenRequest.onupgradeneeded = () => {
      const db = dbOpenRequest.result;

      if (db.objectStoreNames.contains(DB_OBJECT_STORE_NAME)) {
        db.deleteObjectStore(DB_OBJECT_STORE_NAME);
      }

      db.createObjectStore(DB_OBJECT_STORE_NAME);
    };

    return new Promise<IDBDatabase | null>((resolve) => {
      dbOpenRequest.onerror = () => resolve(null);
      dbOpenRequest.onsuccess = () => {
        const db = dbOpenRequest.result;
        resolve(db);
      };
    });
  } catch (err) {
    return null;
  }
};

/**
 * Gets a page from the DB.
 * @param db
 * @param href
 */
const getPageFromDB = async (db: IDBDatabase, href: string) => {
  return new Promise<string | null>((resolve) => {
    const transaction = db.transaction(DB_OBJECT_STORE_NAME);
    const objectStore = transaction.objectStore(DB_OBJECT_STORE_NAME);
    const request = objectStore.get(href);

    request.onerror = () => resolve(null);
    request.onsuccess = () => resolve(request.result);
  });
};

/**
 * Stores a page in the DB.
 * @param db
 * @param href
 * @param rawPage
 */
const storePageInDB = async (db: IDBDatabase, href: string, rawPage: string) => {
  return new Promise<void>((resolve) => {
    const transaction = db.transaction(DB_OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(DB_OBJECT_STORE_NAME);
    const request = objectStore.put(rawPage, href);

    request.onerror = () => resolve();
    request.onsuccess = () => resolve();
  });
};
