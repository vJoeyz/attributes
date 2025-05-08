import { addListener, ARIA_EXPANDED_KEY } from '@finsweet/attributes-utils';
import { createFocusTrap, type FocusTrap } from 'focus-trap';

import { ANCHOR_TEXT } from '../utils/constants';
import { getSettingSelector } from '../utils/selectors';
import type { AnimationSettings } from '../utils/types';
import { getAnimationSettings } from './settings';

/**
 * Handles a modal's functionality.
 *
 * @param modalElement
 * @param openTriggers
 * @param closeTriggers
 * @param modalAnimationSettings
 *
 * @returns A cleanup callback.
 */
export const handleModal = (
  modalElement: HTMLElement,
  openTriggers: Element[],
  closeTriggers: Element[],
  modalAnimationSettings: AnimationSettings
) => {
  const { parentElement } = modalElement;
  if (!parentElement) return;

  const {
    actions: modalActions,
    duration: modalDuration,
    easing: modalEasing,
    display: modalDisplay,
  } = modalAnimationSettings;

  const customAnimationChildren = getCustomAnimationChildren(modalElement);

  // Anchor
  const anchor = new Comment(ANCHOR_TEXT);
  parentElement.insertBefore(anchor, modalElement);

  // State
  let isAnimating = false;
  let isOpen: boolean;
  let focusTrap: FocusTrap | undefined;

  // Open buttons
  const openCleanups = openTriggers.map((openTrigger) => {
    const openCleanup = addListener(openTrigger, 'click', async (e) => {
      e.preventDefault();

      if (isAnimating || isOpen) return;

      isAnimating = true;

      // Animate
      await Promise.all([
        modalActions.animateIn(modalElement, {
          duration: modalDuration,
          easing: modalEasing,
          display: modalDisplay,
          target: document.body,
        }),
        Promise.all(
          customAnimationChildren.map(([child, { actions, duration, easing, display }]) =>
            actions.animateIn(child, {
              display,
              duration: duration || modalDuration,
              easing: easing || modalEasing,
            })
          )
        ),
      ]);

      isAnimating = false;
      isOpen = true;

      // Set focus trap
      focusTrap ||= createFocusTrap(modalElement, {
        returnFocusOnDeactivate: true,
      });

      focusTrap.activate();

      // Set aria-expanded to true
      [...openTriggers, ...closeTriggers].forEach((trigger) => trigger.setAttribute(ARIA_EXPANDED_KEY, 'true'));
    });

    return openCleanup;
  });

  // Close buttons
  const handleClose = async (e: Event) => {
    e.preventDefault();

    if (isAnimating || isOpen === false) return;

    isAnimating = true;

    // Animate
    await Promise.all([
      modalActions.animateOut(modalElement, {
        duration: modalDuration,
        easing: modalEasing,
        target: parentElement,
        insertAfter: anchor,
      }),
      Promise.all(
        customAnimationChildren.map(([child, { actions, duration, easing }]) =>
          actions.animateOut(child, {
            duration: duration || modalDuration,
            easing: easing || modalEasing,
          })
        )
      ),
    ]);

    parentElement.insertBefore(modalElement, anchor);

    isAnimating = false;
    isOpen = false;

    // Deactivate focus trap
    focusTrap?.deactivate();

    // Set aria-expanded to false
    [...openTriggers, ...closeTriggers].forEach((trigger) => trigger.setAttribute(ARIA_EXPANDED_KEY, 'false'));
  };

  const closeCleanups = closeTriggers.map((closeTrigger) => {
    const closeCleanup = addListener(closeTrigger, 'click', handleClose);
    return closeCleanup;
  });

  const escapeCleanup = addListener(window, 'keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose(e);
    }
  });

  // Cleanup
  return () => {
    for (const cleanup of openCleanups) cleanup();
    for (const cleanup of closeCleanups) cleanup();
    escapeCleanup();
  };
};

/**
 * @returns Custom animation data for a modal's children.
 * @param modalElement
 */
const getCustomAnimationChildren = (modalElement: HTMLElement) => {
  const settingsKeys = ['animation', 'duration', 'easing', 'display'] as const;
  const selector = settingsKeys.map((key) => getSettingSelector(key)).join(',');

  const children = [...modalElement.querySelectorAll<HTMLElement>(selector)];

  const customAnimationChildren = children.map((child) => {
    const animationSettings = getAnimationSettings(child);
    return [child, animationSettings] as const;
  });

  return customAnimationChildren;
};
