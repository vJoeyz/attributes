import { type FsAttributeKey, type FsAttributesCallback } from '@finsweet/attributes-utils';

import { ATTRIBUTES_MODULE_NAME, SOLUTION_ATTRIBUTE_NAME } from './constants';
import { FinsweetAttributesModule } from './FinsweetAttributesModule';

/**
 * Inits the Finsweet Attributes library.
 */
export const initAttributes = () => {
  const { fsAttributes } = window;

  // Avoid initting Attributes more than once.
  if (fsAttributes && !Array.isArray(fsAttributes)) {
    return;
  }

  // Collect pre-existing callbacks
  const callbacks = Array.isArray(fsAttributes) ? (fsAttributes as FsAttributesCallback[]) : [];

  // Init Attributes object
  window.fsAttributes = window.FsAttributes = {
    solutions: {},
    process: new Set<FsAttributeKey>(),

    push(...args) {
      for (const [key, callback] of args) {
        this.solutions[key]?.loading?.then(callback);
      }
    },

    import(solution) {
      if (this.process.has(solution)) return;

      const module = document.createElement(ATTRIBUTES_MODULE_NAME);
      module.setAttribute(SOLUTION_ATTRIBUTE_NAME, solution);

      const existingModule = document.querySelector(`${ATTRIBUTES_MODULE_NAME}[${SOLUTION_ATTRIBUTE_NAME}]`);

      const target = existingModule?.parentNode || document.body;

      target.insertBefore(module, existingModule);

      return this.solutions[solution]?.loading;
    },

    destroy() {
      for (const solution in this.solutions) {
        this.solutions[solution as keyof typeof this.solutions]?.destroy?.();
      }
    },
  };

  // Init Attributes
  customElements.define(ATTRIBUTES_MODULE_NAME, FinsweetAttributesModule);

  // Run pre-existing callbacks
  window.fsAttributes.push(...callbacks);
};
