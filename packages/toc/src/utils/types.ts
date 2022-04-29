export interface HeadingData {
  level: number;
  headingElement?: HTMLHeadingElement;
  id?: string;
  headingWrapper?: HTMLDivElement;
}

export interface LinkData {
  level: number;
  linkElement: HTMLAnchorElement;
  component: HTMLElement;
}

export interface TOCData extends HeadingData, LinkData {
  referenceNode: Element;
  linkWrapper: HTMLElement;
  ixTrigger: HTMLElement | null;
  anchor: Node;
}

export type ScrollOffsetStyles = Partial<Pick<HTMLElement['style'], 'scrollMarginTop' | 'scrollMarginBottom'>>;
