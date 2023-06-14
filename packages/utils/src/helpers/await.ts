import type { FsAttributeKey } from '../types';

/**
 * Waits for the defined Attribute to be fully loaded.
 * @param key The Attribute key.
 */
export const awaitAttributeLoaded = (key: FsAttributeKey) => window.fsAttributes.solutions[key]?.loading;

/**
 * @returns A promise that resolves once Webflow has fully loaded.
 */
export const awaitWebflowReady = async () => {
  return new Promise((resolve) => {
    window.Webflow ||= [];
    window.Webflow.push(resolve);
  });
};

/**
 * @returns A promise that resolves once the DOM is ready.
 */
export const awaitDOMReady = async () => {
  return new Promise((resolve) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', resolve);
    } else {
      resolve(undefined);
    }
  });
};
