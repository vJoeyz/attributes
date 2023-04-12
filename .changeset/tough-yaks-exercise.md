---
'@finsweet/attributes-cmsstatic': minor
'@finsweet/attributes-cmscore': minor
---

Added new `fs-cmsstatic-repeat="{REPEAT_INDEX}"` Attribute. When applied to an `fs-cmsstatic` element, this element will be automatically cloned and replicated through the entire list following the repeat index.

_Example:_

- `fs-cmsstatic-element="static-item"`
- `fs-cmsstatic-order="2"`
- `fs-cmsstatic-repeat="8"`

These Attributes will inject the element defined as static in the 2nd position of the list, and will replicate the element every 8 list items.

Additionally, issues with `cmsstatic` + `cmsfilter` and `cmssort` compatibility have been fixed.
