# `favcustom` Attribute

Customize Favicon for a specific page.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'favcustom',
  (linkHref) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the url to the favicon.

## License

[Apache 2.0](../../LICENSE.md)
