import type { CalendarEventStore, CalendarEventTypes } from './types';

export const stores: Record<CalendarEventTypes, CalendarEventStore> = {
  google: new Map(),
  outlook: new Map(),
  apple: new Map(),
};
