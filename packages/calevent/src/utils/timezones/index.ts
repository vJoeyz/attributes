import { isNotEmpty } from '@finsweet/attributes-utils';

import timezones from './timezones.json';

interface TimeZone {
  label: string;
  tzCode: string;
  name: string;
  utc: string;
}

export const currentTimezoneCode = Intl.DateTimeFormat().resolvedOptions().timeZone;

export const isValidTimeZone = (tzCode: string | undefined): boolean => {
  return isNotEmpty(tzCode) && timezones.some((tz) => tz.tzCode === tzCode);
};

export const getTimeZoneByCode = (tzCode: string): TimeZone | undefined => {
  return timezones.find((tz) => tz.tzCode === tzCode);
};

export type { TimeZone };
export default timezones as TimeZone[];
