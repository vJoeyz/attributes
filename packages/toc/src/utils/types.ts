import { HEADINGS } from './constants';

export type Heading = typeof HEADINGS[number];

export interface HeadingData {
  level: number;
  headingElement?: HTMLHeadingElement;
  children: HeadingData[];
}

export interface LinkData {
  level: number;
  linkElement: HTMLAnchorElement;
  parentElement: HTMLElement;
  ixTrigger: HTMLElement | null;
}
