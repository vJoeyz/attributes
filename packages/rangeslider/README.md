# `rangeslider` Attribute

Build a custom Range Slider Form component natively in Webflow.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'rangeslider',
  (handleInstances) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the instances of the `Handle` classes for each active range slider on the page. Each value is a tuple with `[Handle, Handle | undefined]` objects representing the minimum and maximum (optional) handles of the range slider.

## The `Handle` object

The `Handle` class represents a draggable handle element in a range slider component. It manages the handle's position, value, constraints, and interactions with other elements like input fields and value displays.

### Properties

| Property  | Type          | Description                              |
| --------- | ------------- | ---------------------------------------- |
| `element` | `HTMLElement` | The DOM element representing the handle. |

### Methods

#### `Handle.getValue()`

Returns the current value of the handle.

- Returns: `number` - The current value of the handle.

```javascript
// Get the current value of a handle
const value = handleInstance.getValue();
console.log(`Current value: ${value}`);
```

#### `Handle.setValue(newValue, updateInputElement)`

Sets a new value to the handle. The handle's position is automatically updated based on the new value.

- `newValue` (number): The new value to set.
- `updateInputElement` (boolean, optional): Defines if the linked input element should be updated. Defaults to `true`.
- Returns: `boolean` - `true` if the value was updated, `false` if the value was unchanged or out of bounds.

```javascript
// Set the handle to a specific value
handleInstance.setValue(50);

// Set the value without updating the input element
handleInstance.setValue(75, false);
```

#### `Handle.getConstraints()`

Returns the current minimum and maximum value constraints for the handle.

- Returns: `[number, number]` - An array with the minimum and maximum values.

```javascript
// Get the current constraints
const [min, max] = handleInstance.getConstraints();
console.log(`Min: ${min}, Max: ${max}`);
```

#### `Handle.setConstraints(minValue, maxValue)`

Sets new minimum and maximum value constraints for the handle.

- `minValue` (number): The new minimum value.
- `maxValue` (number): The new maximum value.

```javascript
// Set new constraints for the handle
handleInstance.setConstraints(20, 80);
```

#### `Handle.destroy()`

Destroys the handle instance, removing all event listeners and cleaning up resources.

## License

[Apache 2.0](../../LICENSE.md)
