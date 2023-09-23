import dayjs from 'dayjs';

import {
  type CalendarEvent,
  type CalendarEventOrganizer,
  ELEMENTS,
  type Google,
  type NormalizedCalendarEvent,
  type Outlook,
  queryElement,
  TimeFormats,
} from '../utils';
import { eventify } from './eventify';

/**
 * Format the start and end time.
 * @param {NormalizedCalendarEvent} event start and end time
 * @param dateTimeFormat The date time format i.e 'allDay', 'dateTimeUTC'
 * @returns {Object} The formatted start and end time
 */
function formatTimes(
  { startTime, endTime }: NormalizedCalendarEvent,
  dateTimeFormat: keyof typeof TimeFormats
): { start: string; end: string } {
  const format = TimeFormats[dateTimeFormat];
  return { start: startTime.format(format), end: endTime.format(format) };
}

/**
 * Make the calendar event object.
 * @param element The Html element
 * @param instanceIndex The instance index
 * @param scope The element scope
 * @returns The calendar event object
 */
function makeEvent(
  element: HTMLElement,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): CalendarEvent {
  const title = getElementTextContent('title', instanceIndex, scope) ?? '';
  const start = getElementTextContent('start', instanceIndex, scope) ?? '';
  const end: string | undefined = getElementTextContent('end', instanceIndex, scope);
  const timezone = getElementTextContent('timezone', instanceIndex, scope);
  const location = getElementTextContent('location', instanceIndex, scope);
  const description = getElementHTMLContent('description', instanceIndex, scope);

  return {
    title,
    start,
    end,
    timezone,
    location,
    description,
  };
}

/**
 * Get the text content of an Html element.
 * @param attributeElement The attribute element i.e 'google', 'outlook'
 * @param instanceIndex The instance index
 * @param scope The element scope
 * @returns The element text content
 */
function getElementTextContent(
  attributeElement: (typeof ELEMENTS)[number],
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): string | undefined {
  const element = queryElement(attributeElement, { instanceIndex, scope });
  return element?.textContent;
}

/**
 * Get the html content of an Html element.
 * @param attributeElement The attribute element i.e 'google', 'outlook'
 * @param instanceIndex The instance index
 * @param scope The element scope
 * @returns The element text content
 */
function getElementHTMLContent(
  attributeElement: (typeof ELEMENTS)[number],
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): string | undefined {
  const element = queryElement(attributeElement, { instanceIndex, scope });

  if (!element) return undefined;

  // minify html and remove new lines and tabs from html
  return minifyHTML(element.innerHTML);
}

function minifyHTML(html: string) {
  // Use regular expressions to remove newlines, tabs, spaces around tags, and extra spaces
  return html
    .replace(/\n/g, '')
    .replace(/\t/g, '')
    .replace(/\s*(<[^>]*>)\s*/g, '$1');
}

/**
 * Collects the Google calendar event data.
 * @param trigger The trigger element that was clicked
 * @param instanceIndex The instance index
 * @param scope The element scope
 * @returns The Google calendar event data object
 */
export function collectGoogleData(
  trigger: HTMLElement,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): Google {
  const eventDetails = makeEvent(trigger, instanceIndex, scope);
  const event = eventify(eventDetails);

  const { start, end } = formatTimes(event, event.allDay ? 'allDay' : 'dateTimeUTC');

  const details: Google = {
    action: 'TEMPLATE',
    text: event.title,
    details: event.description,
    location: event.location,
    trp: event.busy,
    dates: `${start}/${end}`
    recur: event.rRule ? `RRULE:${event.rRule}` : undefined;
  };

  if (event.guests && event.guests.length) {
    details.add = event.guests.join();
  }

  return details;
}

export function collectOutlookData(
  trigger: HTMLElement,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): Outlook {
  const eventDetails = makeEvent(trigger, instanceIndex, scope);
  const event = eventify(eventDetails, false);

  const { start, end } = formatTimes(event, 'dateTimeLocal');

  const details: Outlook = {
    path: '/calendar/action/compose',
    rru: 'addevent',
    startdt: start,
    enddt: end,
    subject: event.title,
    body: event.description,
    location: event.location,
    allday: event.allDay || false,
  };

  return details;
}

export function collectIcsData(
  trigger: HTMLElement,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): Record<string, string | CalendarEventOrganizer | undefined>[] {
  const eventDetails = makeEvent(trigger, instanceIndex, scope);
  const event = eventify(eventDetails);

  const formattedDescription: string = (event.description || '')
    .replace(/,/gm, ',')
    .replace(/;/gm, ';')
    .replace(/\r\n/gm, '\n')
    .replace(/\n/gm, '\\n')
    .replace(/(\\n)[\s\t]+/gm, '\\n');

  const formattedLocation: string = (event.location || '')
    .replace(/,/gm, ',')
    .replace(/;/gm, ';')
    .replace(/\r\n/gm, '\n')
    .replace(/\n/gm, '\\n')
    .replace(/(\\n)[\s\t]+/gm, '\\n');

  const { start, end } = formatTimes(event, event.allDay ? 'allDay' : 'dateTimeUTC');

  const dateStamp = dayjs(new Date()).utc().format(TimeFormats['dateTimeUTC']);
  const calendarChunks: Record<string, string | CalendarEventOrganizer | undefined>[] = [
    {
      key: 'BEGIN',
      value: 'VCALENDAR',
    },
    {
      key: 'VERSION',
      value: '2.0',
    },
    {
      key: 'PRODID',
      value: event.title,
    },
    {
      key: 'BEGIN',
      value: 'VEVENT',
    },
    {
      key: 'URL',
      value: event.url,
    },
    {
      key: 'DTSTART',
      value: start,
    },
    {
      key: 'DTEND',
      value: end,
    },
    {
      key: 'DTSTAMP',
      value: dateStamp,
    },
    {
      key: 'RRULE',
      value: event.rRule,
    },
    {
      key: 'SUMMARY',
      value: event.title,
    },
    {
      key: 'DESCRIPTION',
      value: formattedDescription,
    },
    {
      key: 'LOCATION',
      value: formattedLocation,
    },
    {
      key: 'ORGANIZER',
      value: event.organizer,
    },
    {
      key: 'UID',
      value: Math.floor(Math.random() * 100000)
        .toString()
        .replace('.', ''),
    },
    {
      key: 'END',
      value: 'VEVENT',
    },
    {
      key: 'END',
      value: 'VCALENDAR',
    },
  ];

  return calendarChunks;
}
