# `videohls` Attribute

Implement [hls.js](https://github.com/video-dev/hls.js/) to a Webflow project.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'videohls',
  (hlsInstancesStore) => {
    // Your code goes here.
  },
]);
```

The `result` object contains a map with all the [Hls](https://github.com/video-dev/hls.js/blob/master/docs/API.md) instances: `Map<HTMLVideoElement, Hls>`.

## License

[Apache 2.0](../../LICENSE.md)
