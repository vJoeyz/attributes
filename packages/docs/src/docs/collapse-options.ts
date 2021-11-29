import { getSelector, OPTIONS_TRIGGER_SELECTOR } from '../utils/constants';
import { simulateEvent } from '@finsweet/ts-utils';

/**
 * Enables the `Collapse All` floating button.
 */
export const initCollapseOptions = () => {
  const collapseAllDropdownsTrigger = document.querySelector<HTMLAnchorElement>(
    getSelector('element', 'collapseAllDropdowns')
  );

  if (!collapseAllDropdownsTrigger) return;

  collapseAllDropdownsTrigger.style.display = 'none';

  const expandedToggles: Set<Element> = new Set();

  window.addEventListener('click', (e) => {
    const { target } = e;

    if (!(target instanceof Element)) return;

    const isToggleElement = target.closest(OPTIONS_TRIGGER_SELECTOR);

    if (isToggleElement) {
      const wasExpanded = expandedToggles.has(isToggleElement);

      if (wasExpanded) {
        expandedToggles.delete(isToggleElement);

        if (!expandedToggles.size) collapseAllDropdownsTrigger.style.display = 'none';

        return;
      }

      expandedToggles.add(isToggleElement);

      collapseAllDropdownsTrigger.style.display = '';

      return;
    }

    const isCollapseAllTriggerElement = target.closest<HTMLAnchorElement>(
      getSelector('element', 'collapseAllDropdowns')
    );

    if (isCollapseAllTriggerElement) {
      for (const toggle of expandedToggles) simulateEvent(toggle, ['click']);

      expandedToggles.clear();
    }
  });
};
