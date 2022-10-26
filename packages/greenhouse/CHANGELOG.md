# @finsweet/attributes-greenhouse

## 0.3.0

### Minor Changes

- e4b3b680: Created new `window.fsAttributes.destroy()` method to support SPA environments.
  This new method allows users to destroy all Attributes instances, cleaning up event listeners, observers, states, global variables, etc.

  Websites that use a client-side router that simulates an SPA environment like [barba.js](https://barba.js.org/) or [Swup](https://swup.js.org/) can now properly init and destroy Attributes.
  After destroying, Attributes can be manually re-initted by calling `window.fsAttribute[ATTRIBUTE_KEY].init()`.

  Updated changesets system, now all updates will be correctly reflected in [the official updates page](https://www.finsweet.com/attributes/updates).

## 0.2.1

### Patch Changes

- Updated dependencies [4792998a]
- Updated dependencies [4792998a]
  - @global/constants@1.2.0
  - @finsweet/attributes-cmscore@1.8.0
  - @global/factory@1.1.5

## 0.2.0

### Minor Changes

- 07f32375: Created `fs-cmsattribute` Attribute

### Patch Changes

- Updated dependencies [07f32375]
  - @global/constants@1.1.0
  - @global/factory@1.1.4
  - @finsweet/attributes-cmscore@1.7.2

## 0.1.3

### Patch Changes

- Updated dependencies [d8a4bf6f]
  - @finsweet/attributes-cmscore@1.7.1

## 0.1.2

### Patch Changes

- Updated dependencies [ef56d454]
  - @finsweet/attributes-cmscore@1.7.0

## 0.1.1

### Patch Changes

- 5801086b: Use departments and offices associated with jobs for filters

## 0.1.0

### Minor Changes

- 2190d26f: Integrated with `cmsload` and `cmsfilter` and added all features.

## 0.0.4

### Patch Changes

- 96c6f6b0: Added filter for group by jobs

## 0.0.3

### Patch Changes

- a00e5a8f: Added nested collection

## 0.0.2

### Patch Changes

- 9e2dbe6c: Added missing description and removing all CMS List template items.

## 0.0.1

### Patch Changes

- a721125f: Added package
