import type { CALENDAR_EVENT_PLATFORMS } from './constants';

/**
 * Defines a calendar event platform type.
 */
export type CalendarEventPlatform = keyof typeof CALENDAR_EVENT_PLATFORMS;

/**
 * Defines a calendar event object type.
 */
export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  timezone?: string | null;
  location?: string | null;
  description?: string | null;
}

/**
 * Defines a Google calendar event object type.
 * @see https://developers.google.com/calendar/v3/reference/events
 */
export interface GoogleCalendarEvent extends CalendarEvent {
  platform: 'google';
}

export type GoogleCalendarEventQuery = Partial<GoogleCalendarEventQueryParams>;

/**
 * Defines a Google calendar event query params object type.
 * @see https://github.com/InteractionDesignFoundation/add-event-to-calendar-docs/blob/main/services/google.md
 */
export interface GoogleCalendarEventQueryParams {
  action: 'TEMPLATE';
  text: string;
  dates: string;
  ctz: string;
  details: string | null;
  location: string | null;
  crm: string;
  trp: boolean;
  sprop: string;
  add: string;
  src: string;
  recur: string;
}

/**
 * Defines an Outlook calendar event object type.
 * @see https://docs.microsoft.com/en-us/previous-versions/office/office-365-api/api/version-2.0/calendar-rest-operations#EventResource
 */
export interface OutlookCalendarEvent extends CalendarEvent {
  platform: 'outlook';
}

/**
 * Defines an Apple calendar event object type.
 * @see https://developer.apple.com/documentation/webkitjs/wkevent
 */
export interface AppleCalendarEvent extends CalendarEvent {
  platform: 'apple';
}

/**
 * Defines a calendar event store data object type.
 */
export type CalendarEventStoreData = Pick<
  CalendarEvent,
  'title' | 'start' | 'end' | 'timezone' | 'location' | 'description'
> & {
  eventUrl: URL;
};

/**
 * Defines a calendar event store type.
 */
export type CalendarEventStore = Map<HTMLElement, HTMLElement>;
