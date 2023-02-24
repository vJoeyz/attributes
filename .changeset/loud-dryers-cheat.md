---
'@finsweet/attributes-component': minor
---

feat: when importing an external component, automatically convert all the relative urls to absolute using the source origin as the base.
ie:

- Footer is imported from `https://attributes.finsweet.com/styleguides`.
- Contains relative links like `/agency`.
- Links are rewritten to be `https://wf.finsweet.com/agency`.
