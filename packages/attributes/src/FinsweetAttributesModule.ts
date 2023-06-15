import type { FsAttributeKey } from '@finsweet/attributes-utils';

import { PREVENT_INIT_ATTRIBUTE_NAME, SOLUTION_ATTRIBUTE_NAME } from './constants';
import { loadAttribute } from './load';

export class FinsweetAttributesModule extends HTMLElement {
  public solution: FsAttributeKey | null = null;
  public preventInit = false;
  public destroy: (() => void) | undefined;

  async connectedCallback() {
    // Collect solution info
    this.solution = this.getAttribute(SOLUTION_ATTRIBUTE_NAME) as FsAttributeKey | null;
    this.preventInit = this.hasAttribute(PREVENT_INIT_ATTRIBUTE_NAME);

    const { solution, preventInit } = this;
    if (!solution) return;

    const { fsAttributes } = window;

    // Ensure that the attribute is only initted once
    if (fsAttributes.process.has(solution)) return;
    fsAttributes.process.add(solution);

    // Init controls
    const controls = (fsAttributes.solutions[solution] ||= {});

    // Check if user wants to programatically init the attribute
    // Instead of automatically initting it
    if (!preventInit) {
      controls.loading = new Promise((resolve) => {
        controls.resolve = (value) => {
          resolve(value);
          delete controls.resolve;
        };
      });
    }

    // Load Attribute package
    try {
      const { init, version, SETTINGS } = await loadAttribute(solution);

      controls.init = init;
      controls.version = version;

      if (preventInit) return;

      // Parse global settings
      const globalSettingsEntries = Object.entries(SETTINGS).reduce<[string, string | null][]>((acc, [, { key }]) => {
        const value = this.getAttribute(key);

        acc.push([key, value]);

        return acc;
      }, []);

      const globalSettings = Object.fromEntries(globalSettingsEntries);

      // Init attribute
      const { result, destroy } = (await init(globalSettings)) || {};

      this.destroy = destroy;

      // Finalize controls
      controls.destroy = () => this.remove();
      controls.resolve?.(result);

      return result;
    } catch (err) {
      console.error(err);
    }
  }

  disconnectedCallback() {
    const { solution } = this;
    if (!solution) return;

    this.destroy?.();
    window.fsAttributes.process.delete(solution);
  }
}
