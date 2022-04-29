export interface HeadingData {
  level: number;
  headingElement?: HTMLHeadingElement;
  id?: string;
}

export interface LinkData {
  level: number;
  linkElement: HTMLAnchorElement;
  component: HTMLElement;
}

export interface TOCData extends HeadingData, LinkData {
  referenceNode: Element;
  wrapperElement: HTMLElement;
  ixTrigger: HTMLElement | null;
}

export type ScrollOffsetStyles = Partial<Pick<HTMLElement['style'], 'scrollMarginTop' | 'scrollMarginBottom'>>;
