---
"@finsweet/attributes-richtext": patch
---

`feature`: Added external components source caching.
Previously, if multiple components were loaded from an external URL like `/components`, that page was fetched once for each component.
Now the library will cache all loaded external pages and only fetch them once, no matter how many components are being loaded from them.

`fix`: Fixed the library stopping when a component was loaded from an invalid URL.
