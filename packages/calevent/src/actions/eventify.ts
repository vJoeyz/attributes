import type { ManipulateType } from 'dayjs';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

import type { CalendarEvent, NormalizedCalendarEvent } from '../utils';
import { isValidTimeZone } from '../utils/timezones';

dayjs.extend(utc);
dayjs.extend(timezone);

export const eventify = (eventDetails: CalendarEvent, toUtc = true): NormalizedCalendarEvent => {
  const { start, end, duration, ...rest } = eventDetails;
  let startTime = toUtc ? dayjs(start).utc() : dayjs(start);
  let endTime = end
    ? toUtc
      ? dayjs(end).utc()
      : dayjs(end)
    : (() => {
        if (eventDetails.allDay) {
          return startTime.add(1, 'day');
        }
        if (duration && duration.length === 2) {
          const value = Number(duration[0]);
          const unit = duration[1] as ManipulateType;
          return startTime.add(value, unit);
        }
        return toUtc ? dayjs().utc() : dayjs();
      })();

  if (isValidTimeZone(eventDetails.timezone)) {
    startTime = startTime.tz(eventDetails.timezone, true);
    endTime = endTime.tz(eventDetails.timezone, true);
  } else {
    startTime = startTime.tz(dayjs.tz.guess(), true);
    endTime = endTime.tz(dayjs.tz.guess(), true);
  }

  return {
    ...rest,
    startTime: startTime,
    endTime: endTime,
  };
};
