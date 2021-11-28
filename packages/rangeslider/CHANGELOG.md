# `rangeslider` Changelog

## [v1.2.0] 28th November 2021

- Published to NPM.

## [v1.2.0-beta.0] 27th November 2021

- Added support for the range slider being initially hidden on page load. Now the library will recalculate the range slider's position whenever its visibility changes.
- Added new `fs-rangeslider-update` attribute: setting this attribute to the `wrapper` element, allows users to define when should the `<input>` elements' value be updated.

  - `fs-rangeslider-update="move"`: The value of the `<input>` elements will be update on every single move of a `handle`.
  - `fs-rangeslider-update="release"`: The value of the `<input>` elements will only be updated when the user releases the mouse/finger from the `handle`. This is very useful for use cases like `cmsfilter`, where we don't want to be constantly triggering a new filter cycle when the user is still moving the `handle`.
    On the other hand, the `display-value` elements will still be updated real-time.

  When not specified, defaults to `fs-rangeslider-update="move"`.

## [v1.1.2] 15th November 2021

- Reduced `resize` debouncing from 100ms to 50ms.

## [v1.1.1] 15th November 2021

- Added `examples.json` to the package.

## [v1.1.0] 15th November 2021

- Added new `fs-rangefilter-formatdisplay="true"` attribute.
  Now, by default all `fs-rangefilter-element="display-value"` elements will display the numeric value without formatting.
  If the `formatdisplay` attribute is added to the `wrapper` element, the `display-value` elements will display a formatted value (formatting defaults to the user's country conventions, some countries use commas and other countries use dots).
- Added an extra check to make sure the Handles' start values are adjusted to the `step` increment coefficient.
- Added an extra rule to set the Handles' start value to the `minRange` or `maxRange` if the provided value doesn't match the range. When this happens, a custom `Debug` message will be displayed to warn the user when using `debugMode`.
- Added an extra `Debug` alert that warns the user when the provided `step` value doesn't fit the provided `[min,max]` range.

## [v1.0.1] 15th November 2021

- Made sure the track is set to `position: relative` and the Handles & Fill have the correct `position: absolute` values.

## [v1.0.0] 15th November 2021

- Added support to recalculate the range slider position on window `resize` events.
- Removed dependency on `Emittery`, reduced the package size from 14KB to 9KB.
- Internal refactoring and performance improvements.

## [v1.0.0-beta.8] 14th November 2021

- Fixed values not being correctly calculated when the `min range` was set to a different value than 0.

## [v1.0.0-beta.7] 14th November 2021

- Fixed `v1.0.0-beta.6` code not being included in the build. Ooops!

## [v1.0.0-beta.6] 14th November 2021

- Improved `mousedown` boundaries to correctly pick the handles when they are located at the ends of the track.

## [v1.0.0-beta.5] 14th November 2021

- Added locale converter to the `display-value` element.

## [v1.0.0-beta.4] 13th November 2021

- Added `fs-rangeslider-element="display-value"` attribute.

## [v1.0.0-beta.3] 13th November 2021

- Fixed `Handle.handleInputChange` issue.

## [v1.0.0-beta.2] 13th November 2021

- Switched `input` event listeners on Handles to `change` events to avoid collisions with other solutions like `cmsfilter`.

## [v1.0.0-beta.1] 13th November 2021

- Added two way binding with the `<input>` elements.
  Now any `input` event that is emitted from the elements will automatically update the value of the correspondent Handle.

## [v1.0.0-beta.0] 13th October 2021

- Created the attribute package.
