import { addListener, isElement } from '@finsweet/attributes-utils';

import { CALENDAR_PLATFORMS, getElementSelector } from '../utils';
import { stores } from '../utils/stores';
import type { CalendarEventStoreData, CalendarEventTypes } from '../utils/types';

export const listenTriggerClicks = () => {
  const clickCleanup = addListener(document, 'click', (e) => {
    const { target } = e;
    if (!isElement(target)) return;
    for (const key in CALENDAR_PLATFORMS) {
      const platform = key as CalendarEventTypes;
      const trigger = target.closest<HTMLElement>(getElementSelector(platform));
      if (!trigger) continue;
      const calendarEventData = stores[platform].get(trigger);
      if (calendarEventData) triggerCalendarEvent(calendarEventData);
      break;
    }
  });
  return clickCleanup;
};

const triggerCalendarEvent = ({
  title,
  start,
  end,
  timezone,
  location,
  description,
  platform,
}: CalendarEventStoreData) => {
  // open a new tab and go to the calendar event url
  const url = getCalendarEventUrl({ title, start, end, timezone, location, description, platform });
  const newWindow = window.open(url, '_blank');
  if (newWindow) {
    newWindow.focus();
  }
};

const getCalendarEventUrl = ({
  title,
  start,
  end,
  timezone,
  location,
  description,
  platform,
}: CalendarEventStoreData) => {
  // Check if the provided platform is supported
  if (CALENDAR_PLATFORMS.hasOwnProperty(platform)) {
    const baseURL = CALENDAR_PLATFORMS[platform];

    // Format date to 'YYYYMMDD' format
    const startDate = new Date(start).toISOString().slice(0, 10).replace(/-/g, '');
    const endDate = new Date(end).toISOString().slice(0, 10).replace(/-/g, '');

    // Format time to 'HHmmss' format
    const startTime = String(new Date(start).getTime).replace(/:/g, '') + '00';
    const endTime = String(new Date(end).getTime()).replace(/:/g, '') + '00';

    // Encode event details
    const encodedTitle = encodeURIComponent(title);
    const encodedTimezone = encodeURIComponent(timezone);

    // Construct the final URL
    const eventURL = `${baseURL}&text=${encodedTitle}&dates=${startDate}T${startTime}/${endDate}T${endTime}&ctz=${encodedTimezone}`;

    return eventURL;
  }
  throw new Error('Unsupported calendar platform');
};
