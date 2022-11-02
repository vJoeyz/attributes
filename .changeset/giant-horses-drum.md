---
'@finsweet/attributes-cmsattribute': minor
'@finsweet/attributes-cmscore': minor
'@finsweet/attributes-cmsfilter': minor
'@finsweet/attributes-cmsload': minor
'@finsweet/attributes-cmsnest': minor
'@finsweet/attributes-cmsselect': minor
'@finsweet/attributes-cmssort': minor
'@finsweet/attributes-countitems': minor
'@finsweet/attributes-greenhouse': minor
'@finsweet/attributes-socialshare': minor
---

Added support to use any regular element as a CMS element, essentially allowing users to do things like:

- Filtering a list of static elements.
- Sorting a list of static elements.
- Creating Tabs from static elements.
- Creating Slides from static elements.
- etc...

Users can now do this is by adding the following Attributes to any element:

- `fs-cms-element="wrapper"`
- `fs-cms-element="list"`
- `fs-cms-element="item"`
- `fs-cms-element="pagination-wrapper"`
- `fs-cms-element="pagination-next"`
- `fs-cms-element="pagination-previous"`
- `fs-cms-element="page-count"`
- `fs-cms-element="empty"`

This essentially tells Attributes to not only look for the native Webflow elements (Collection List Wrapper, Collection List, etc...), but to also look for these Attributes.

In order to make static systems work, users have to replicate the same exact structure of the Webflow native CMS. So for example, to create a static list, users have to define elements using the same architecture:

```
|_ Collection List Wrapper (fs-cms-element="wrapper")
  |_ Collection List (fs-cms-element="list")
    |_ Collection List Item (fs-cms-element="item")
```
