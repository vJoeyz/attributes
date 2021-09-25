interface Params {
  param?: unknown;
}

export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    console.log(params);
  } else if (params) {
    console.log(params);
  }
};
