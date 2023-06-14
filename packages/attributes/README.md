# Finsweet Attributes

Core package for all Finsweet Attributes.

## Getting started

### 1. CDN Import

Import the core package in your project:

```html
<!-- [Attributes by Finsweet] Core -->
<script async type="module" src="https://cdn.jsdelivr.net/npm/@finsweet/attributes"></script>
```

_Important:_ It's only required to import it once, no matter how many Attribute solutions are added.

### 2. Define the solutions

Define the Attribute solutions that should be loaded on each page by adding the following inside the `<head>` tag:

```html
<finsweet-attributes solution="SOLUTION_KEY" />
```

Replace `SOLUTION_KEY` with the key of the solution you want to load. You can load as many solutions as you want.

Example:

```html
<finsweet-attributes solution="cmsload" />
<finsweet-attributes solution="cmsnest" />
<finsweet-attributes solution="cmsfilter" />
<finsweet-attributes solution="cmssort" />
<finsweet-attributes solution="cmsselect" />
<finsweet-attributes solution="rangeslider" />
```

### 3. Optional: Define the global settings

Attributes reads the settings from the HTML Attributes that are added to the elements on the page. But some solutions also allow passing a set of global settings.

To do so, add the settings to the module elements **without prefixes**.

Example:

```html
<finsweet-attributes solution="component" proxy="https://api.finsweet.com/cors?url=" />
```
