---
"@finsweet/attributes-cmsfilter": patch
---

Improved accessibility for when `fs-cmsfilter-element="reset"` is applied to a Radio button.

Previously, only clicks on the `fs-cmsfilter-element="reset"` elements were supported, making Radio buttons not accessible when using them with the keyboard.

Now the library will detect if `fs-cmsfilter-element="reset"` is being used on a Radio button and listen for `input` events too.
