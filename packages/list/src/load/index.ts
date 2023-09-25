import type { List } from '../components/List';
import type { SETTINGS } from '../utils/constants';
import { initLoadUnderMode } from './load-under';
import { initRenderAllMode } from './render-all';

type LoadModeValues = (typeof SETTINGS)['loadmode']['values'];
type LoadMode = LoadModeValues[keyof LoadModeValues];

export const initListLoading = async (list: List, mode: LoadMode) => {
  const cleanup =
    mode === 'render-all'
      ? await initRenderAllMode(list)
      : mode === 'load-under'
      ? await initLoadUnderMode(list)
      : undefined;

  //   : mode === infinite
  //   ? await initInfiniteMode(list)
  //   : mode === pagination
  //   ? await initPaginationMode(list)
  //   : await initDefaultMode(list);
};
