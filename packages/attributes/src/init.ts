import { awaitDOMReady, type FsAttributeKey, type FsAttributesCallback } from '@finsweet/attributes-utils';

import { loadAttribute } from './load';
import { parseAttributeGlobalSettings } from './settings';

export const initAttributes = () => {
  const { fsAttributes } = window;

  // FsAttributes already exists so we just make sure that any newly imported <script> is also parsed and initted.
  if (fsAttributes && !Array.isArray(fsAttributes)) {
    return initAttributeModules();
  }

  // Collect pre-existing callbacks
  const callbacks = Array.isArray(fsAttributes) ? (fsAttributes as FsAttributesCallback[]) : [];

  // Init Attributes object
  window.fsAttributes = window.FsAttributes = {
    init: initAttributeModules,
    solutions: {},
    process: new Set<FsAttributeKey>(),

    push(...args) {
      for (const [key, callback] of args) {
        initAttribute(key);
        this.solutions[key]?.loading?.then(callback);
      }
    },

    async import(key) {
      return initAttribute(key);
    },

    destroy() {
      for (const key in this.solutions) {
        this.solutions[key as keyof typeof this.solutions]?.destroy?.();
      }
    },
  };

  // Run pre-existing callbacks
  window.fsAttributes.push(...callbacks);

  // Init Attributes
  initAttributeModules();

  if (document.readyState === 'loading') {
    awaitDOMReady().then(initAttributeModules);
  }
};

/**
 * Searches for all <finsweet-attributes> elements and inits the corresponding attribute.
 */
const initAttributeModules = () => {
  const modules = document.querySelectorAll('finsweet-attributes[solution]');

  for (const module of modules) {
    const key = module.getAttribute('solution') as FsAttributeKey | null;
    if (!key) continue;

    initAttribute(key, module);
  }
};

/**
 * Inits an attribute.
 * @param key
 * @param module The <finsweet-attributes> element.
 * @returns The result of the attribute's init function.
 */
const initAttribute = (key: FsAttributeKey, module?: Element) => {
  const { fsAttributes } = window;

  // Ensure that the attribute is only initted once
  if (fsAttributes.process.has(key)) return;

  fsAttributes.process.add(key);

  // Init controls
  const controls = (fsAttributes.solutions[key] ||= {});

  // Check if user wants to programatically init the attribute
  // Instead of automatically initting it
  const preventInit = module?.hasAttribute('preventinit');

  if (!preventInit) {
    controls.loading = new Promise((resolve) => {
      controls.resolve = (value) => {
        resolve(value);
        delete controls.resolve;
      };
    });
  }

  return loadAttribute(key)
    .then(async ({ init, version, SETTINGS }) => {
      controls.init = init;
      controls.version = version;

      if (!preventInit) {
        // Parse global settings
        const globalSettings = parseAttributeGlobalSettings(SETTINGS, module);

        // Init attribute
        const { result, destroy } = (await init(globalSettings)) || {};

        // Finalize controls
        controls.destroy = () => {
          destroy?.();
          fsAttributes.process.delete(key);
        };

        controls.resolve?.(result);

        return result;
      }
    })
    .catch(console.error);
};
