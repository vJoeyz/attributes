# `cmssort` Changelog

## [v1.4.0] 17th November 2021

- Added support for `cmscore` versioning.

## [v1.3.3] 16th November 2021

- Fixed items not being sorted correctly when some of them have an empty value.

## [v1.3.2] 16th November 2021

- Updated `cmscore` import.

## [v1.3.1] 16th November 2021

- Updated `cmscore` import.

## [v1.3.0] 16th November 2021

- [Buttons]: Added support to override `fs-cmsort-asc="ASC_CSS_CLASS"` and `fs-cmsort-desc="DESC_CSS_CLASS"` at the buttons level.
  If the CSS Class Attributes are set to the list, all buttons inherit them by default, but each individual button can override these global values by setting the Attributes to it.
- [Buttons]: Added new `fs-cmssort-reverse="true"` optional attribute. If set to a button element, the first click will trigger `desc` sorting instead of the default `asc`.

## [v1.2.0] 14th November 2021

- Added support to use `fs-cmssort-element="scroll-anchor"`.
  If set to any element on the page, the viewport will scroll into it when a sorting action is triggered.

## [v1.1.1] 14th November 2021

- Added support for Alphanumeric sorting. Before, the following strings:

  - Project 0
  - Project 1
  - Project 2
  - Project 10
  - Project 11
  - Project 12
  - Project 20
  - Project 21
  - Project 22

  Were sorted like:

  - Project 0
  - Project 1
  - Project 10
  - Project 11
  - Project 12
  - Project 2
  - Project 20
  - Project 21
  - Project 22

  Now strings that contain both characters and numbers are analyzed and sorted correctly.

## [v1.1.0] 12th November 2021

- Added support to build sorting systems with native `Dropdown` components.
- Internal refactoring / performance improvements.

## [v1.0.1] 11th November 2021

- Updated `cmscore` import.

## [v1.0.0] 24th October 2021

- Created the attribute package.
