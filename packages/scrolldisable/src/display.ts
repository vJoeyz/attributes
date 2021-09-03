import debounce from 'just-debounce';
import { isVisible } from '@finsweet/ts-utils';
import { ATTRIBUTES, NAV_MEDIAS } from './constants';
import { disableScrolling, enableScrolling, findFirstScrollableElement } from './scroll';

// Contants
const {
  element: { key: elementKey, values: elementValues },
  matchMedia: { key: matchMediaKey },
} = ATTRIBUTES;

// Store
const displayTriggersStore: Map<
  HTMLElement,
  { visible: boolean; firstScrollableElement?: HTMLElement; matchMedia?: string | null }
> = new Map();

/**
 * Handle the state change
 * @param trigger
 */
const handleStateChange = (trigger: HTMLElement, preserveScrollTargets: NodeListOf<Element>) => {
  // Get the trigger data
  const triggerData = displayTriggersStore.get(trigger);
  if (!triggerData) return;

  // Extract values
  const { matchMedia, firstScrollableElement, visible: wasVisibleBefore } = triggerData;

  // Make sure the matchMedia requirement is valid
  if (matchMedia && !window.matchMedia(`(${matchMedia})`).matches) return;

  // Check visibility
  const visible = isVisible(trigger);
  if (visible === wasVisibleBefore) return;

  // Perform actions
  if (wasVisibleBefore) enableScrolling();
  else if (visible) {
    for (const target of [...preserveScrollTargets, firstScrollableElement || trigger]) disableScrolling(target);
  }

  // Store new state
  triggerData.visible = visible;
};

/**
 * Handle the display triggers
 */
export const initDisplayTriggers = (preserveScrollTargets: NodeListOf<Element>): void => {
  // DOM Elements
  const displayTriggers = document.querySelectorAll<HTMLElement>(
    `[${elementKey}="${elementValues.whenVisible}"], [${elementKey}="${elementValues.nav}"] .w-nav-menu`
  );

  // Define MutationObserver's callback
  const callback: MutationCallback = (mutations) => {
    const trigger = mutations[0].target as HTMLElement;
    handleStateChange(trigger, preserveScrollTargets);
  };

  // Create MutationObserver
  const observer = new MutationObserver(callback);

  // Init
  for (const trigger of displayTriggers) {
    // Get the trigger's matchMedia requisite
    let matchMedia = trigger.getAttribute(matchMediaKey);

    if (trigger.classList.contains('w-nav-menu')) {
      const navbar = trigger.closest<HTMLDivElement>('.w-nav');
      const collapsesAt = navbar?.dataset.collapse as keyof typeof NAV_MEDIAS | undefined;

      if (collapsesAt) matchMedia = NAV_MEDIAS[collapsesAt];
    }

    // Get the first scrollable element
    const firstScrollableElement = findFirstScrollableElement(trigger) || trigger;

    // Store the trigger's data
    displayTriggersStore.set(trigger, {
      visible: isVisible(trigger),
      firstScrollableElement,
      matchMedia,
    });

    // Trigger a state change check
    handleStateChange(trigger, preserveScrollTargets);

    // Observe the element
    observer.observe(trigger, {
      attributes: true,
      attributeFilter: ['style', 'class'],
    });
  }

  // Handle window resize events
  const debouncedStateChangeHandler = debounce(() => {
    enableScrolling();
    for (const trigger of displayTriggers) handleStateChange(trigger, preserveScrollTargets);
  }, 250);

  window.addEventListener('resize', debouncedStateChangeHandler);
};
