# @finsweet/attributes-cmsstatic

## 1.3.0

### Minor Changes

- 02469177: Added new `fs-cmsstatic-repeat="{REPEAT_INDEX}"` Attribute. When applied to an `fs-cmsstatic` element, this element will be automatically cloned and replicated through the entire list following the repeat index.

  _Example:_

  - `fs-cmsstatic-element="static-item"`
  - `fs-cmsstatic-order="2"`
  - `fs-cmsstatic-repeat="8"`

  These Attributes will inject the element defined as static in the 2nd position of the list, and will replicate the element every 8 list items.

  Additionally, issues with `cmsstatic` + `cmsfilter` and `cmssort` compatibility have been fixed.

## 1.2.0

### Minor Changes

- e4b3b680: Created new `window.fsAttributes.destroy()` method to support SPA environments.
  This new method allows users to destroy all Attributes instances, cleaning up event listeners, observers, states, global variables, etc.

  Websites that use a client-side router that simulates an SPA environment like [barba.js](https://barba.js.org/) or [Swup](https://swup.js.org/) can now properly init and destroy Attributes.
  After destroying, Attributes can be manually re-initted by calling `window.fsAttribute[ATTRIBUTE_KEY].init()`.

  Updated changesets system, now all updates will be correctly reflected in [the official updates page](https://www.finsweet.com/attributes/updates).

## 1.1.2

### Patch Changes

- b820da2d: Improved `targetIndex` logic

## 1.1.1

### Patch Changes

- 37e8c54e: Item order has set internally as optional and default value to 0

## 1.1.0

### Minor Changes

- 4792998a: Created new `fs-cmsstatic` Attribute.

### Patch Changes

- Updated dependencies [4792998a]
- Updated dependencies [4792998a]
  - @global/constants@1.2.0
  - @finsweet/attributes-cmscore@1.8.0
  - @global/factory@1.1.5
