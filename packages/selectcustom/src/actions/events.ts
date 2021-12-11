import { closeDropdown } from '$utils/dropdowns';
import { updateOptionsState } from './state';

import type { Settings } from '../utils/types';

/**
 * Listens for click events on the custom elements.
 * @param settings The instance {@link Settings}.
 */
export const listenEvents = (settings: Settings) => {
  const { dropdownList, optionsStore } = settings;

  dropdownList.addEventListener('click', async (e) => {
    e.preventDefault();

    const { target } = e;

    if (!(target instanceof Element)) return;

    const optionElement = target.closest('a');
    if (!optionElement) return;

    const optionData = optionsStore.find(({ element }) => element === optionElement);
    if (!optionData || optionData.selected) return;

    updateOptionsState(settings, optionData);

    closeDropdown(settings.dropdownToggle);
  });
};
