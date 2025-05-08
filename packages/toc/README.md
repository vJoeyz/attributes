# `toc` Attribute

Automatically generate a table of contents based on heading tags. Works with Webflow Rich Text, Webflow "Current" class, and anchor scroll. CMS, static, and all text elements are supported.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes ||= [];
window.FinsweetAttributes.push([
  'toc',
  () => {
    // Your code goes here.
  },
]);
```

## License

[Apache 2.0](../../LICENSE.md)
