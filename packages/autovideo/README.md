# `autovideo` Attribute

Auto-play videos only in viewport.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'autovideo',
  (videoStore) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the [VideoStore](#the-videostore-object) instance.

## The VideoStore object

Work in progress 🚧

## License

[Apache 2.0](../../LICENSE.md)
