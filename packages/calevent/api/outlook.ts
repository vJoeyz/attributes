export interface Outlook extends Record<string, string | boolean | number | undefined> {
  path: string;
  rru: string;
  startdt: string;
  enddt: string;
  subject: string;
  allday?: boolean;
  body?: string;
  location?: string;
}
