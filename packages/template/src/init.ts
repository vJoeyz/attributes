interface Params {
  param?: unknown;
}

export function init({ params }: { params: Params }): void;
export function init({ currentScript }: { currentScript: HTMLOrSVGScriptElement | null }): void;
export function init({
  currentScript,
  params,
}: {
  currentScript?: HTMLOrSVGScriptElement | null;
  params?: Params;
}): void {
  console.log(currentScript, params);
}
