import type { Page } from '@playwright/test';
import { expect, test } from '@playwright/test';

import { waitAttributeLoaded } from './utils';

export const MAIN_KEY = 'fs-consent';

const ACTIONS = {
  allow: 'allow',
  deny: 'deny',
  submit: 'submit',
} as const;

export const COMPONENTS = {
  banner: `[${MAIN_KEY}-element="banner"]`,
  preferences: `[${MAIN_KEY}-element="preferences"]`,
  manager: `[${MAIN_KEY}-element="fixed-preferences"]`,
} as const;

export const BUTTONS = {
  allow: `[${MAIN_KEY}-element="${ACTIONS.allow}"]`,
  deny: `[${MAIN_KEY}-element="${ACTIONS.deny}"]`,
  submit: `[${MAIN_KEY}-element="${ACTIONS.submit}"]`,
  openPreferences: `[${MAIN_KEY}-element="open-preferences"]`,
  close: `[${MAIN_KEY}-element="close"]`,
} as const;

export const COOKIE_KEYS = {
  main: MAIN_KEY,
  consentsUpdated: `${MAIN_KEY}-updated`,
};

export const DYNAMIC_KEYS = {
  checkbox: (key: string): string => `[${MAIN_KEY}-checkbox="${key}"]`,
  gtmEvent: (key: string): string => `${key}-activated`,
};

/**
 * Gets a cookie from the page.
 * @param page
 * @param cookieName
 */
const getCookie = async (page: Page, cookieName: string) => {
  const cookies = await page.context().cookies();

  const cookie = cookies.find(({ name }) => name === cookieName);
  return cookie;
};

test.beforeEach(async ({ page }) => {
  await page.goto('https://attributes-consent-sandbox-v2.webflow.io/');
});

const reloadPage = async (page: Page) => {
  if (!page.isClosed()) {
    await page.reload();

    await waitAttributeLoaded(page, 'consent');
  } else {
    console.log('Page has been closed.');
  }
};

/**
 * We have a single test because the context needs to be preserved between tests.
 * And playwright applies Isolation {@link https://playwright.dev/docs/browser-contexts} by default.
 */
test('Attributes Consent', async ({ page, browserName }) => {
  // TODO: skipping webkit tests, for some reason there is a timeout error
  if (browserName === 'webkit') {
    console.log('INTENTIONAL TODO: Skipped webkit browser because of known issue.');
    return;
  }

  page.on('console', (message) => {
    console.log('LOGGED:', message);
  });

  await waitAttributeLoaded(page, 'consent');

  const banner = page.locator(COMPONENTS.banner);
  const bannerClose = banner.locator(BUTTONS.close);

  const manager = page.locator(COMPONENTS.manager);

  const preferences = page.locator(COMPONENTS.preferences);
  const preferencesOpen = page.locator(BUTTONS.openPreferences).first();
  const preferencesSubmit = preferences.locator(BUTTONS.submit);
  const preferencesAllowAll = preferences.locator(BUTTONS.allow);
  const preferencesDeny = preferences.locator(BUTTONS.deny);

  const marketingCheckbox = preferences.locator('[fs-consent-checkbox="marketing"]');
  const personalizationCheckbox = preferences.locator('[fs-consent-checkbox="personalization"]');
  const analyticsCheckbox = preferences.locator('[fs-consent-checkbox="analytics"]');

  const analyticsEvent = DYNAMIC_KEYS.gtmEvent('analytics');

  // Banner should display, Manager and Preferences should be hidden.
  await expect(banner).toBeVisible();
  await expect(manager).not.toBeVisible();
  await expect(preferences).not.toBeVisible();

  // Clicking the close button closes the Banner, but on page refresh the Banner displays again.
  await page.waitForTimeout(250);

  await bannerClose.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(banner).not.toBeVisible();
  await expect(manager).toBeVisible();
  await expect(preferences).not.toBeVisible();

  await reloadPage(page);

  await expect(banner).toBeVisible();
  await expect(manager).not.toBeVisible();
  await expect(preferences).not.toBeVisible();

  // Clicking the Preferences button closes the Banner and opens the Preferences.
  await page.waitForTimeout(250);

  await preferencesOpen.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(banner).not.toBeVisible();
  await expect(preferences).toBeVisible();

  // Selecting the analytics checkbox doesn't fire any scripts, closes the Preferences, opens the Manager, displays the Manager and pushes the 'analytics-activated' event to the dataLayer.
  await page.waitForTimeout(250);

  await analyticsCheckbox.check({ force: true });
  await preferencesSubmit.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(manager).toBeVisible();
  await expect(preferences).not.toBeVisible();

  expect(await getCookie(page, '_ga')).toBeUndefined();
  expect(await getCookie(page, COOKIE_KEYS.main)).toBeDefined();

  const analyticsActivatedEvent = await page.evaluate(
    (analyticsEvent) => window.dataLayer?.find(({ event }) => event === analyticsEvent),
    analyticsEvent
  );

  expect(analyticsActivatedEvent).toBeDefined();

  await reloadPage(page);

  await expect(banner).not.toBeVisible();
  await expect(manager).toBeVisible();

  // Clicking the Manager closes it and opens the Preferences.
  await page.waitForTimeout(250);

  await preferencesOpen.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(manager).not.toBeVisible();
  await expect(preferences).toBeVisible();

  // The Analytics checkbox in the Preferences preserves the checked state.
  await expect(analyticsCheckbox).toBeChecked();

  // Clicking "Allow All" selects all the consent checkboxes, closes the Preferences and fires the GA script.
  await page.waitForTimeout(250);

  await preferencesAllowAll.dispatchEvent('click');

  await page.waitForTimeout(1000);

  await expect(marketingCheckbox).toBeChecked();
  await expect(personalizationCheckbox).toBeChecked();
  await expect(analyticsCheckbox).toBeChecked();

  await page.waitForTimeout(5000);

  expect(await getCookie(page, '_ga')).toBeDefined();

  await reloadPage(page);

  await page.waitForTimeout(1000);

  expect(await getCookie(page, '_ga')).toBeDefined();

  // Opening the Preferences and clicking Reject All sets the fs-consent-updated cookie
  await page.waitForTimeout(250);

  const preferencesOpenFirst = page.locator(BUTTONS.openPreferences).first();

  await preferencesOpenFirst.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(manager).not.toBeVisible();
  await expect(preferences).toBeVisible();

  await preferencesDeny.dispatchEvent('click');

  await page.waitForTimeout(250);

  await expect(marketingCheckbox).not.toBeChecked();
  await expect(personalizationCheckbox).not.toBeChecked();
  await expect(analyticsCheckbox).not.toBeChecked();

  await page.waitForTimeout(1000);

  expect(await getCookie(page, COOKIE_KEYS.consentsUpdated)).toBeDefined();

  // After page refresh, the GA cookie is no longer present.
  await reloadPage(page);

  expect(await getCookie(page, '_ga')).toBeUndefined();
});
