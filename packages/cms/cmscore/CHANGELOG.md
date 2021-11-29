# `cmscore` Changelog

## [v1.4.0] 23rd November 2021

- Added `CMSList.originalItemsOrder` prop.
- Added `CMSList.clearItems()` method.

## [v1.3.1] 23rd November 2021

- Updated `restartWebflow` from `@finsweet/ts-utils` to include `lightbox` module support.

## [v1.3.0] 23rd November 2021

- Replaced `CMSItem.needsXXXRestart` props to a single `CMSItem.needsWebflowRestart`, as they were redundant.
- Added `CMSList.restartWebflow` prop.
- Improved `restartWebflowModules` and added support for `CMSList.restartWebflow`.

## [v1.2.0] 17th November 2021

- Included the `package.version` in the exports.
- Forced `trim` and `toLowerCase` to all prop field keys.
- Added support for `cmscore` versioning.

## [v1.1.2] 15th November 2021

- Updated `restartWebflow` from `@finsweet/ts-utils` to support persisting state after reinitializing the `ix2` module.

## [v1.1.1] 11th November 2021

- Added a `100ms` timeout to the `CMSList.scrollToAnchor` method to avoid it being cancelled by the browser's smooth scrolling.

## [v1.1.0] 11th November 2021

- Switched `CMSList.validItems` prop from `boolean` to an array of the valid `CMSItem` instanced.
- Internal refactors.

## [v1.0.24] 11th November 2021

- Fixed rendering issues caused by the `Empty State` not being correctly displayed in some situations.

## [v1.0.23] 9th November 2021

- Improved Webflow Modules restarting in the `render` workflow.

## [v1.0.22] 9th November 2021

- Updated `ts-utils` to add support for `commerce` sites.

## [v1.0.21] 9th November 2021

- Added `highlightValues` optional prop in each `CMSItemProp` object. Used for `fs-cmsfilter-highlight`.

## [v1.0.20] 9th November 2021

- Now the `originalHTML` is stored in each `CMSItemProp.elements` record. Used to reset the elements after having mutated them in actions like `fs-cmsfilter-highlight`.

## [v1.0.19] 9th November 2021

- Refactored `CMSList.itemsCount` usage.

## [v1.0.18] 9th November 2021

- Added `CMSItemProp.elements` property that stores the value holders.

## [v1.0.17] 9th November 2021

- Added optional `scrollToAnchor` param to the `CMSList.switchPage()` method.

## [v1.0.16] 9th November 2021

- Added `CMSList.itemsCount` and `CMSList.addItemsCount()` to display the amount of items of the list.

## [v1.0.15] 9th November 2021

- `CMSList.switchPage()` now triggers a `scrollToAnchor` action, if the anchor element exists.

## [v1.0.14] 8th November 2021

- Fixed `renderitems` and `additems` events fire order.
- Added `CMSList.resetIx` prop that is used in the `render` function.

## [v1.0.13] 8th November 2021

- Added `CMSList.totalPages` prop.

## [v1.0.12] 8th November 2021

- Added optional `animate` param to `CMSList.renderItems`.

## [v1.0.11] 5th November 2021

- Awaited `renderitems` event emit on `CMSList.renderItems`.

## [v1.0.10] 5th November 2021

- Added `CMSList.paginationCount` prop.

## [v1.0.9] 5th November 2021

- Added `CMSList.scrollAnchor` prop + `CMSList.scrollToAnchor()` method.

## [v1.0.8] 27th October 2021

- Added new methods to `CMSList`.

## [v1.0.7] 27th October 2021

- Published missing updates.

## [v1.0.6] 27th October 2021

- Improved rendering logic.

## [v1.0.5] 27th October 2021

- `cmscore`: Removed `CMSList.initialItems` prop.

## [v1.0.4] 27th October 2021

- `cmscore`: Added `CMSList.initialItems` prop.

## [v1.0.3] 26th October 2021

- Changed `CMSItemProps.mode` to `CMSItemProps.range`.

## [v1.0.2] 26th October 2021

- Modified `CMSItem.props` value type to a `Set` instead of `Array`.

## [v1.0.1] 26th October 2021

- `CMSItem`: Added `mode` in `props` property.

## [v1.0.0] 25th October 2021

- Created Attribute package.
