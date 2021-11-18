# `cmsfilter` Changelog

## [v1.5.3] 17th November 2021

- Added support for initial state values on `Checkboxes`, `Radio` and `Select` elements.
  If any of these elements has a default value, on page load the filters will automatically:
  - Store the value.
  - Trigger a filter + render workflow.
  - Sync the tags, if required.
  - Sync the URL query params, if required.

## [v1.5.2] 17th November 2021

- Fixed `examples.json` not being available on NPM.

## [v1.5.1] 17th November 2021

- Added support to override default list animation duration when it was already set by other `cms` packages.
- Memoized `TagData.textNode` prop so the text node doesn't have to be queried every time a text update is required on a tag.

## [v1.5.0] 17th November 2021

- Added support for `cmscore` versioning.

## [v1.4.0] 16th November 2021

- Added a visibility tracker to Submit Buttons. If it's not visible (`display: none`), the list will auto-filter as if there was no Submit Button.
- Added a window `resize` observer to update the visibility status of the Submit Button.
- Switched tags from being rendered on `input` events to being rendered on during the filter rendering. This assures that, if a Submit Button exists and it's visible, the tags will only be updated when submitting the form.

## [v1.3.1] 16th November 2021

- Updated `cmscore` import.

## [v1.3.0] 16th November 2021

- Added `fs-cmsfilter-tagformat` override at the filters level + a new `fs-cmsfilter-tagcategory` attribute.
- Updated `cmscore` import.

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
