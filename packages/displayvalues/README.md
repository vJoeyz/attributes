# `displayvalues` Attribute

Display the value of a Form Element.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'displayvalues',
  (formElements) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the form elements that are currently active on the page.

## License

[Apache 2.0](../../LICENSE.md)
