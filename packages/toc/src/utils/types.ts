import { HEADINGS } from './constants';

export type Heading = typeof HEADINGS[number];

export interface HeadingData {
  level: number;
  headingElement?: HTMLHeadingElement;
  id?: string;
  children: HeadingData[];
}

export interface LinkData {
  level: number;
  linkElement: HTMLAnchorElement;
  component: HTMLElement;
  // ixTrigger: HTMLElement | null;
}

export interface TableData extends LinkData {
  test: string;
}
