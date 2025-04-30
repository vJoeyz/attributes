export type ComponentTargetData = {
  target: HTMLElement;
  instance: string | null;
  source?: URL;
  proxiedSource?: URL;
  loadCSS: boolean;
  autoRender: boolean;
  resetIx: boolean;
  positions: number[];
};

export type ComponentData = ComponentTargetData & {
  component: HTMLElement;
  shadowRoot?: ShadowRoot;
};
