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

  const { href } = collapseAllDropdownsTrigger;
  const { hash } = new URL(href);

  const scrollAnchor = hash ? document.querySelector(href) : null;

  collapseAllDropdownsTrigger.style.display = 'none';

  const expandedToggles: Set<Element> = new Set();

  let collapsing = false;

  window.addEventListener('click', (e) => {
    if (collapsing) return;

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
      collapsing = true;

      e.preventDefault();

      for (const toggle of expandedToggles) simulateEvent(toggle, ['click']);

      expandedToggles.clear();

      scrollAnchor?.scrollIntoView({ block: 'start', behavior: 'smooth' });

      collapseAllDropdownsTrigger.click();

      collapsing = false;
    }
  });
};
