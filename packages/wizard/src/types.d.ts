
/**
 * Defines the module to enable svg support
 */
declare module '*.svg' {
  const content: string;
  export default content;
}


declare namespace svelte.JSX {
  interface HTMLAttributes<T> {
    onclick_outside?: () => void
  }
}
