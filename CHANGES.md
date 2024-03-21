# Attributes v2 Changes

## TODOs

- [ ] Update docs package.
- [ ] Fix schemas implementation.
- [ ] Generate API files (`schema.json` and `examples.json`) for each attribute.
- [ ] Update tests to use new instances syntax.
- [ ] Migrate LaunchDarkly tests to `packages/attributes/tests/`
- [ ] Review all Attributes to see what implementations can be improved.
- [ ] Create a `v1` branch from master before merging this PR, so we can maintain the old version for a while.

## Changes

### Global

- New single package `@finsweet/attributes` that uses custom elements as modulepreload alternative: `<finsweet-attributes>`.
- Global settings are added to the `<finsweet-attributes>` custom elements as attributes with no prefixes.
- See `packages/attributes/README.md` for more details.

### Attribute-specific

#### `cmsattribute`

- Deprecated `cmsattribute` in favor of the native CMS Attributes in Webflow.

### Automated Support Tool

Deprecated `@finsweet/attributes-support` in favor of the upcoming Webflow Designer Extensions.

We'll eventually create an official Webflow Designer Extension that will be available in the Webflow Marketplace.

### Public API

- New `fsAttributes.import()` method.
- New `fsAttributes.init()` method.
- Attribute-specific APIs are moved to `fsAttributes.solutions[attributeKey]`.

### Internal

- Moved `global` folder into a single standalone package in `packages/utils`.
- New `AttributeElements` and `AttributeSettings` interfaces for better type safety.
- New `generateSelectors` factory method with better helpers.
