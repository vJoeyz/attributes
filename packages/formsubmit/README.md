# `formsubmit` Attribute

Smart actions after Webflow form submission.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes ||= [];
window.FinsweetAttributes.push([
  'formsubmit',
  (formInstances) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the [Form](#the-form-object) instances that are currently active on the page.

## The `Form` object

The `Form` class represents a Webflow form with enhanced functionality for handling submissions, resets, redirects, and other post-submission actions.

### Properties

| Property         | Type                 | Description                                        |
| ---------------- | -------------------- | -------------------------------------------------- |
| `form`           | `HTMLFormElement`    | The form element being enhanced.                   |
| `formBlock`      | `HTMLElement`        | The Webflow form block containing the form.        |
| `successMessage` | `HTMLElement`        | The success message element within the form block. |
| `errorMessage`   | `HTMLElement`        | The error message element within the form block.   |
| `submitButtons`  | `HTMLInputElement[]` | Array of submit buttons within the form.           |

### Methods

#### `Form.triggerIx()`

Triggers all the Webflow Interactions associated with the form's success state.

#### `Form.destroy()`

Removes all event listeners attached to the form, effectively cleaning up any enhancements made by the `formsubmit` attribute.

## License

[Apache 2.0](../../LICENSE.md)
