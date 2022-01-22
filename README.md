# Attributes by Finsweet

Work in progress.

This is a monorepo containing all of the **Attributes** solutions.

This monorepo uses [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces) to manage all the packages, you will need to have `npm 7.x` or higher in your machine to be able to use them.

Please, make sure you know how to use `npm Workspaces` before performing any actions.

## How to start

`cd` into one of the packages.

Use `npm run dev` to build for development, you can define a custom build directory setting an `.env` file.

Use `npm run build` to build for production.

## Specification

### Elements

Elements are represented by instance unique identifier, use only once to set specific behavior into DOM element.

- Main Examples:

  - `fs-cmsload-element="list"` - Define the CMS Collection to enable load more.
  - `fs-cmssort-element="list"` - Define the CMS Collection to enable sort.

- There are used for identify certain behavior into each attributes too:
  - `fs-cmsload-element="page-button"` - Define the button for load more. Only for pagination.
  - `fs-untransform-element="trigger-on"` - Define the trigger to enable untransform in modal.

Those functionalities are consolidated for element behavior. There will be multiple elements with same value only in multiples instances.

_**Conflicts**: cmsload → Button Trigger → Use the same element more than once in page. Its possible to have to change specification to handle multiples elements once._

### Settings

Settings are represented by modification / customization for elements or identifier behavior. There are used in (applied to) specific elements to control how attribute will act in page. All setting must belong to at least one element/identifier.

Main examples:

- `fs-cmsload-mode` - Defines the loading mode for CMS Collections.
- `fs-scrolldisable-media` - Defines the media query to restrict when element act as a trigger.
- `fs-cmsfilter-match` - Define if identifier must match any or all CMS Collection Field in Item.

### Identifiers

The identifiers have the characteristics:

Represent a field:

- CMS Collection with one to many ocurrencies
- Component. Zero to many ocurrencies.

Can exists multiples identifiers in the same instance and even for multiples instances in the same page.

Identifier should be linked together in multiples places in page. It’s usual to have the identifier to link a button to a CMS Field value, or to have and identifier linked a component to a placehoder.

Identifiers never can be use alone like elements. There are the following cases:

- There are always need to be in more than one place to be considered an identifier.
- There are always belong to an Element, like a Setting.

#### All cases

`cmssort` - Field Identifier for Select Trigger

- IDENTIFIER-asc
- IDENTIFIER-desc

`cmssort` - Field Identifier for Button Trigger

- Same as above

`cmssort` - Field identifier for Dropdown Trigger

- Same as above

`cmsfilter` - Field identifier

- Add to the Filter UI
- Add to CMS Collection list

`cmsnest` - Nest Collection Identifier

- Add to the Nest Collection List related to the Main CMS Collection.
- Add to the CMS Collection where must show the CMS Nested Items.

We can deduce the following rules:

An identifier must have specializations. Can use the same `appliedTo`.

It can be of type suffix, to add `-asc` and `-desc` for `cmssort` case.

It can be `childOf`, to have elements `childOf` Filter UI and `childOf` Collection list together.

### Cases not covered by specification

#### Not classified cases

- `cmscombine` → List → It will not validate if there are more than one element with the same value. All queries validators for elements use querySelector.

- `cmsfilter` → Filter → It will not validate if there are more than one form with input elements. It will only check for single element filter existence.

- `cmsfilter` → Will not validate start checked:checked.

- `cmsfilter` → Will not validate start checked: radio

- `cmsnest` → List → It will not validate link to CMS Page. I will only check for list element.

- `cmsnest` → Page Template → It will not validate if CMS Collection Page has setup the IDENTIFIER.

- `cmsnest` → List link → It will not validate if setup link for CMS Collection Page.

- `cmsload` → Triggers → It will not validate multiple trigger buttons. Elements are validated only once by Instance.
