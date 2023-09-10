import type { ManipulateType } from 'dayjs';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import type { CalendarEvent, NormalizedCalendarEvent } from '../utils';

dayjs.extend(utc);

export const eventify = (event: CalendarEvent, toUtc = true): NormalizedCalendarEvent => {
  const { start, end, duration, ...rest } = event;
  const startTime = toUtc ? dayjs(start).utc() : dayjs(start);
  const endTime = end
    ? toUtc
      ? dayjs(end).utc()
      : dayjs(end)
    : (() => {
        if (event.allDay) {
          return startTime.add(1, 'day');
        }
        if (duration && duration.length === 2) {
          const value = Number(duration[0]);
          const unit = duration[1] as ManipulateType;
          return startTime.add(value, unit);
        }
        return toUtc ? dayjs().utc() : dayjs();
      })();
  return {
    ...rest,
    startTime: startTime,
    endTime: endTime,
  };
};
