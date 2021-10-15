# `richtext` Changelog

## [v1.1.0] 15th October 2021

- Added support for situations like `<div class="rich-text-tip">**Pro Tip:** Test.</div>`, where `Pro Tip:` is set in bold, thus becoming the following rendered HTML: `<div class="rich-text-tip"><strong>Pro Tip:</strong> Test.</div>`.

## [v1.1.0] 15th October 2021

- Added `fs-richtext-sanitize="true"` option. When set, `DOMPurify` will be dynamically imported and all HTML string swill be sanitized before rendering them.

## [v1.0.1] 15th October 2021

- Made sure the `<!-- fs-richtext-ignore -->` check is trimmed before.

## [v1.0.0] 14th October 2021

- Created the attribute package.
