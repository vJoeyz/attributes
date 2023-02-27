---
'@finsweet/attributes-cmsnest': minor
---

Feat: added new `fs-cmsnest-element="slugs"` + `fs-cmsnest-element="nest-target"` combo.
If used, developers can speed up the nesting workflow by manually defining a comma-separated list of slugs of the items that must be nested.
This gives CMS Nest a hint and avoids the need of the regular template page setup, where the library has to fetch each item's template page to determine what items must be nested.
