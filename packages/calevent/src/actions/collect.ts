import {
  CALENDAR_EVENT_PLATFORMS,
  type CalendarEvent,
  type CalendarEventPlatform,
  ELEMENTS,
  type GoogleCalendarEvent,
  queryElement,
} from '../utils';

export function collectGoogleData(
  trigger: HTMLElement,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): GoogleCalendarEvent {
  const calendarEventData = collectCalendarData('google', instanceIndex, scope);

  return {
    ...calendarEventData,
    platform: 'google',
  };
}

export function collectCalendarData(
  elementKey: CalendarEventPlatform,
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): CalendarEvent & { platform: CalendarEventPlatform; url: string } {
  const title = getElementTextContent('title', instanceIndex, scope);
  const start = getElementTextContent('start', instanceIndex, scope);
  const end = getElementTextContent('end', instanceIndex, scope);
  const timezone = getElementTextContent('timezone', instanceIndex, scope);
  const location = getElementTextContent('location', instanceIndex, scope);
  const description = getElementTextContent('description', instanceIndex, scope);

  // check if title, start and end are defined
  if (!title || !start || !end) {
    throw new Error(`The ${elementKey} element requires a title, start and end element.`);
  }

  const url = CALENDAR_EVENT_PLATFORMS[elementKey];

  // return everything
  return {
    title,
    start,
    end,
    timezone,
    location,
    description,
    platform: elementKey,
    url,
  };
}

function getElementTextContent(
  attributeElement: (typeof ELEMENTS)[number],
  instanceIndex: number | undefined,
  scope: HTMLElement | undefined
): string | null {
  const element = queryElement(attributeElement, { instanceIndex, scope });
  return element && element.textContent ? element.textContent : null;
}
