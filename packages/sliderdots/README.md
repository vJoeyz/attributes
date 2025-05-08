# `sliderdots` Attribute

Populate the Webflow slider dots with content. Add images, text, or any type of element inside native Webflow slider navigation.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'sliderdots',
  (sliderElements) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the slider elements that have been populated with custom dots.

## License

[Apache 2.0](../../LICENSE.md)
