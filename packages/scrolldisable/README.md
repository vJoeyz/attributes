# `scrolldisable` Attribute

Users can prevent the page from scrolling when:

- An element is clicked.
- An element is visible on the page.
- A Nav Menu is open.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes ||= [];
window.FinsweetAttributes.push([
  'scrolldisable',
  () => {
    // Your code goes here.
  },
]);
```

## License

[Apache 2.0](../../LICENSE.md)
