# Attribute Guides - Walkthrough


## Installation

### Option 1: Add to your web page the following HTML tags:

```html
<script async 'https://attributes-guide.vercel.app/build/bundle.js'></script>
<link rel='stylesheet' href='https://attributes-guide.vercel.app/build/bundle.css'>
```

### Options2: Run the loading script on your console


- Open Dev Tools - F12
- Click Console
- Copy and paste the following code

```js
var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.type = 'text/javascript';

script.src = 'https://attributes-guide-13055osf7-mauriciopiber.vercel.app/build/bundle.js';
head.appendChild(script);

var link = document.createElement('link');
link.rel = "stylesheet";
link.type = "text/css";
link.href = "https://attributes-guide-13055osf7-mauriciopiber.vercel.app/build/bundle.css";

document.head.appendChild(link);

```



```
- Click enter to execute.

## Validation

### Oficial documentatil CMS Load

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
yarn tsc && yarn lint && yarn build && yarn test && yarn run check
```
