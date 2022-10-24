import { addListener, simulateEvent } from '@finsweet/ts-utils';
import { TABINDEX_KEY } from 'global/constants/a11ty';

const DISALLOWED_INSTANCES = [
  HTMLAnchorElement,
  HTMLButtonElement,
  HTMLInputElement,
  HTMLTextAreaElement,
  HTMLSelectElement,
  HTMLVideoElement,
  HTMLAudioElement,
];

/**
 * Makes sure all `div` and `li` elements that have a `tabindex` attribute emit a click event on Enter and Space keydown.
 *
 * @returns A callback to remove the event listener.
 */
export const emitClickEvents = () => {
  const handleKeydown = (e: KeyboardEvent) => {
    const { target, key } = e;

    if (key !== 'Enter' && key !== ' ') return;
    if (!target || !(target as Element).getAttribute?.(TABINDEX_KEY)) return;
    if (DISALLOWED_INSTANCES.some((instance) => target instanceof instance)) return;

    e.preventDefault();

    simulateEvent(target, 'click');
  };

  const keydownCleanup = addListener(window, 'keydown', handleKeydown);

  return () => {
    keydownCleanup();
  };
};
