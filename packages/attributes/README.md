<a target="_blank" href="https://finsweet.com/attributes">
  <picture>
    <img src="https://cdn.prod.website-files.com/648b0184fc925cdf643d8b74/681bae7059f00e0e5d4e5c97_banner-attributes.png" alt="Attributes by Finsweet - Free powerful features for your site, no confusing code" />
  </picture>
</a>

[![npm](https://img.shields.io/npm/v/@finsweet/attributes.svg)](https://www.npmjs.com/package/@finsweet/attributes) [![Hits](https://img.shields.io/jsdelivr/npm/hm/@finsweet/attributes)](https://www.npmjs.com/package/@finsweet/attributes) [![License](https://img.shields.io/npm/l/@finsweet/attributes.svg)](LICENSE.md)

## What is Attributes?

Attributes is an open source JavaScript library of solutions for adding filters, sort, load & search options, CMS tabs & sliders —and more— to Webflow using simple HTML attributes.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## API Reference

Attributes will inject a global `window.FinsweetAttributes` object into your project that contains some methods to interact with the library.

To ensure that the library is loaded before you try to access the `window.FinsweetAttributes` object, you can use the following instantiation code:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'ATTRIBUTE_KEY', // 'list', 'copyclip', 'modal', etc.
  (result) => {
    // Your code goes here.
  },
]);
```

### The `FinsweetAttributes` object

#### Properties

| Property  | Type     | Description                                                                                                                    |
| --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `process` | `Set`    | Contains the currently active attribute solutions.                                                                             |
| `modules` | `Object` | Contains the controls for the active attribute solutions ([FinsweetAttributeControls](#the-finsweetattributecontrols-object)). |

#### Methods

| Method                  | Description                                        | Arguments                                                                           |
| ----------------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `push([key, callback])` | Run a callback after an Attribute has loaded.      | `key (string)`: The attribute key.<br>`callback (function)`: The callback function. |
| `load(key)`             | Dynamically load an attribute solution.            | `key (string)`: The attribute key.                                                  |
| `destroy()`             | Destroys the instance and all attribute solutions. |                                                                                     |

### The `FinsweetAttributeControls` object

#### Properties

| Property  | Type      | Description                                                                |
| --------- | --------- | -------------------------------------------------------------------------- |
| `version` | `string`  | The version of the Attribute.                                              |
| `loading` | `Promise` | A promise that resolves once the Attribute has loaded and returns its API. |

#### Methods

| Method      | Description                                                                                            | Arguments |
| ----------- | ------------------------------------------------------------------------------------------------------ | --------- |
| `restart()` | Restarts the Attribute. In practice, this means that the Attribute will be destroyed and loaded again. |           |
| `destroy()` | Destroys the Attribute.                                                                                |           |
