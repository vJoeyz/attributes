interface Params {
  param?: unknown;
}

/**
 * Inits the attribute.
 *
 * Auto init:
 * @param params The current `<script>` element.
 *
 * Programatic init:
 * @param params.param A global parameter.
 */
export const init = (params?: HTMLOrSVGScriptElement | Params | null): void => {
  if (params instanceof HTMLScriptElement || params instanceof SVGScriptElement) {
    console.log(params);
  } else if (params) {
    console.log(params);
  }
};
