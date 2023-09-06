import type { CALENDAR_PLATFORMS } from './constants';

export type CalendarEventTypes = keyof typeof CALENDAR_PLATFORMS;

export interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  timezone: string;
  location: string;
  description: string;
  platform: CalendarEventTypes;
}

export type CalendarEventStoreData = Pick<
  CalendarEvent,
  'title' | 'start' | 'end' | 'timezone' | 'location' | 'description' | 'platform'
> & {
  eventUrl: URL;
};

export type CalendarEventStore = Map<HTMLElement, HTMLElement>;
