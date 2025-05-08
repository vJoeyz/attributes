# `combobox` Attribute

A combo box that helps users select an item from a large list of options.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes ||= [];
window.FinsweetAttributes.push([
  'combobox',
  (dropdownElements) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the dropdown elements that are currently active on the page.

## License

[Apache 2.0](../../LICENSE.md)
