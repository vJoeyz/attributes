import { collectGoogleData } from './actions/collect';
import { createGoogleInvite } from './actions/invite';
import {
  CALENDAR_EVENT_PLATFORMS,
  type CalendarEventPlatform,
  getAttribute,
  getCMSItemWrapper,
  getInstanceIndex,
  queryAllElements,
  stores,
} from './utils';

export const createCalendarEventInstances = (scope?: HTMLElement) => {
  for (const key in CALENDAR_EVENT_PLATFORMS) {
    const platform = key as CalendarEventPlatform;

    // Get all platform elements
    const platformElements = queryAllElements(platform, { scope });

    const create = creators[platform];

    platformElements.forEach(create);
  }
};

const creators: Record<CalendarEventPlatform, (trigger: HTMLElement) => void> = {
  google: (trigger) => {
    if (stores.google.has(trigger)) return;

    const instanceIndex = getInstanceIndex(trigger);

    const cmsListItem = getCMSItemWrapper(trigger);

    const google = collectGoogleData(trigger, instanceIndex, cmsListItem);

    const inviteData = createGoogleInvite(google);

    stores.google.set(trigger, inviteData);
  },
  outlook: function (trigger: HTMLElement): void {
    throw new Error('creators.outlook Function not implemented.');
  },
  apple: function (trigger: HTMLElement): void {
    throw new Error('creators.apple Function not implemented.');
  },
};
