import { setModalA11Y } from './actions/a11y';
import { handleModal } from './actions/modal';
import { getAnimationSettings } from './actions/settings';
import { getInstanceIndex, queryAllElements } from './utils/selectors';

/**
 * Inits a modal component.
 * @param modalElement
 * @returns A cleanup callback.
 */
export const initModal = (modalElement: HTMLElement) => {
  const { parentElement } = modalElement;
  if (!parentElement) return;

  const instanceIndex = getInstanceIndex(modalElement);

  const openTriggers = queryAllElements('open', { instanceIndex });
  const closeTriggers = queryAllElements('close', { instanceIndex });
  if (!openTriggers.length && !closeTriggers.length) return;

  const animationSettings = getAnimationSettings(modalElement);

  setModalA11Y(modalElement, openTriggers, closeTriggers);

  return handleModal(modalElement, openTriggers, closeTriggers, animationSettings);
};
