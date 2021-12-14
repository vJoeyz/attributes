/**
 * Makes sure the window object is defined.
 */
export const initAttributes = () => {
  window.fsAttributes ||= {
    cms: {},
  };
};
