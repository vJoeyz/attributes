# `inject` Attribute

Import components from any internal or external Webflow project.

## Getting Started

Please follow the documentation at [finsweet.com/attributes](https://www.finsweet.com/attributes) to learn how to use Attributes in your Webflow projects.

## Accessing the API

To learn how to access the API, please check the general [API Reference](../attributes/README.md#api-reference) documentation:

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'inject',
  (componentsData) => {
    // Your code goes here.
  },
]);
```

The `result` object contains the [ComponentData](#the-componentdata-object) instances that are currently active on the page.

## The `ComponentData` object

```typescript
type ComponentData = ComponentTargetData & {
  component: HTMLElement; // The component element
  target: HTMLElement; // The target element where the component is injected
  shadowRoot?: ShadowRoot; // The shadow root of the component, if external CSS was injected
  instance: string | null; // The instance ID of the component
  source?: URL; // The source URL of the component
  proxiedSource?: URL; // The proxied source URL of the component, if a proxy is defined
  loadCSS: boolean; // Whether to load CSS for the component
  autoRender: boolean; // Whether to automatically render the component
  resetIx: boolean; // Whether to reset IX2 interactions after injecting the component
  positions: number[]; // The positions of the component in the target element
};
```

## How to programmatically render a component

If the `fs-inject-render="false"` attribute is set, the component will not be rendered automatically. You can render it programmatically by accessing it via the `ComponentData` object.

```javascript
window.FinsweetAttributes = window.FinsweetAttributes || [];
window.FinsweetAttributes.push([
  'inject',
  (componentsData) => {
    const { component, target } = componentsData[0];

    target.append(component);
  },
]);
```

## License

[Apache 2.0](../../LICENSE.md)
