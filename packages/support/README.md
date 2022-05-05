# Attribute Automated Support


## Installation

### Option 1: Run in a page with attributes already loaded

Enter the query string into url, example:

```text
https://my-website.webflow.io?fs-attributes-support=true
```

### Option 2: Add to your web page the following HTML tags

```html
<script async 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-support@1/support.js'></script>
```

### Options 3: Run the loading script on your console

- Open Dev Tools - F12
- Click Console
- Copy and paste the following code

```js
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';

script.src = 'https://cdn.jsdelivr.net/npm/@finsweet/attributes-support@1/support.js';
head.appendChild(script);


```

- Click enter to execute.

### Oficial documentation CMS Load

```link
https://www.finsweet.com/attributes/cms-load/
```

## Contribution

### Instalation

- First install dependencies

```bash
yarn
```

- Run quality chain to check if everything is ok for start.

```bash
yarn tsc && yarn lint &&  yarn run check && yarn build && yarn test
```
