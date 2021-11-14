# `cmsfilter` Changelog

## [v1.2.0] 12th November 2021

- Fixed `undefined` errors when checking range validity in single range props.
- Fixed value checking when multiple non checkbox/radio elements exist in a filter key.
- Fixed `fs-cmsfilter-range` filtering issue when the `from` value was not specified.
- Fixed `fs-cmsfilter-range` values not being correctly set from the URL query params on page load.
- Added support for `fs-rangeslider` sync when setting values from query params on page load.
- Improved tags rendering when the filter is a `range`. Now it outputs a single tag with a `[FROM_VALUE, TO_VALUE]` format, replacing the `undefined` values with a double dash `--`.
- Exposed the `CMSFilters` instances at `window.fsAttributes.cms.filtersInstances`.

## [v1.1.2] 12th November 2021

- Added support to parse numbers that contain symbols like `$` or `,`.

## [v1.1.1] 12th November 2021

- Fixed `filter-results-count` and `hideempty` not being applied initially on page load.
- Added support to using `filter-results-count` and `hideempty` even when users have added duplicated values by mistake.

## [v1.1.0] 11th November 2021

- Added new `fs-cmsfilter-element="filter-results-count"` attribute.
  It can be placed in any Text element inside a `Checkbox Field` or `Radio Field`, and this element will display the amount of items that match that particular filter.
  The results count is dynamically updated every time a filter is applied, only showing the available items in the current filter query.
- Added new `fs-cmsfilter-hideempty="true"` attribute.
  It can be added to any `Checkbox` or `Radio`, specifically to the same element where the `fs-cmsfilter-field="IDENTIFIER"` attribute is added.
  When the current filter has no results in the list, the `Checkbox`/`Radio` element is hidden.
  Very useful to narrow down options to the users when other filters are applied.
- Internal refactorings / performance improvements.

## [v1.0.2] 11th November 2021

- Fixed list animation issue on `nestinitialitems` event when the list was initially filtered by query params.
- Updated `cmscore` import.

## [v1.0.1] 10th November 2021

- Updated `cmscore` import.

## [v1.0.0] 3rd October 2021

- Created the attribute package.
