import { getObjectEntries, getObjectKeys } from '@finsweet/attributes-utils';

import {
  CALENDAR_EVENT_PLATFORMS,
  type CalendarEventPlatform,
  type CalendarEventStoreData,
  type GoogleCalendarEvent,
} from '../utils';

function generateGoogleCalendarEventURL(event: GoogleCalendarEvent) {
  // Define the base Google Calendar event URL
  const baseGoogleCalendarURL = new URL(CALENDAR_EVENT_PLATFORMS[event.platform]);

  // Create an object with query parameters for the event
  const queryParams = {
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${formatDate(event.start)}/${formatDate(event.end)}`,
    ctz: event.timezone,
  };

  // Add the query parameters to the base URL
  const googleCalendarEventURL = new URL(baseGoogleCalendarURL.href);
  getObjectEntries(queryParams).forEach(([key, value]) => {
    if (!value) return;
    googleCalendarEventURL.searchParams.append(key, value);
  });

  return googleCalendarEventURL;
}

export function createGoogleInvite(details: GoogleCalendarEvent) {
  const eventUrl = generateGoogleCalendarEventURL(details);

  return {
    platform: details.platform,
    eventUrl,
  };
}

function formatDate(eventDate: string) {
  const date = new Date(eventDate);

  // Get year, month, day, hours, minutes, and seconds
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  // Format the date string
  const formattedDate = `${year}${month}${day}T${hours}${minutes}${seconds}`;

  return formattedDate;
}
