# `rangeslider` Changelog

## [v1.0.0.beta-7] 14th November 2021

- Fixed `v1.0.0.beta-6` code not being included in the build. Ooops!

## [v1.0.0.beta-6] 14th November 2021

- Improved `mousedown` boundaries to correctly pick the handles when they are located at the ends of the track.

## [v1.0.0.beta-5] 14th November 2021

- Added locale converter to the `display-value` element.

## [v1.0.0.beta-4] 13th November 2021

- Added `fs-rangeslider-element="display-value"` attribute.

## [v1.0.0.beta-3] 13th November 2021

- Fixed `Handle.handleInputChange` issue.

## [v1.0.0.beta-2] 13th November 2021

- Switched `input` event listeners on Handles to `change` events to avoid collisions with other solutions like `cmsfilter`.

## [v1.0.0.beta-1] 13th November 2021

- Added two way binding with the `<input>` elements.
  Now any `input` event that is emitted from the elements will automatically update the value of the correspondent Handle.

## [v1.0.0.beta-0] 13th October 2021

- Created the attribute package.
