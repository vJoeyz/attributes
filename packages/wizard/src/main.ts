import App from './App.svelte';

const section = document.createElement('section');
section.setAttribute('data-id', 'wizard-wrapper');

document.body.appendChild(section);

const root = section.attachShadow({ mode: 'open' });

const app = new App({
  target: root,
  props: {},
});


const styleFonts = `
  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 300;
    src: local('Open Sans Light'),
      local('OpenSans-Light'),
      url(https://fonts.gstatic.com/s/opensans/v13/DXI1ORHCpsQm3Vp6mXoaTXhCUOGz7vYGh680lGh-uXM.woff)
      format('woff');
  }

  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 400;
    src: local('Open Sans'),
    local('OpenSans'),
    url(https://fonts.gstatic.com/s/opensans/v13/cJZKeOuBrn4kERxqtaUH3T8E0i7KZn-EPnyo3HZu7kw.woff) format('woff');
  }

  @font-face {
    font-family: 'Open Sans';
    font-style: normal;
    font-weight: 600;
    src: local('Open Sans Semibold'),
    local('OpenSans-Semibold'),
    url(https://fonts.gstatic.com/s/opensans/v13/MTP_ySUJH_bn48VBG8sNSnhCUOGz7vYGh680lGh-uXM.woff)
    format('woff');
  }
`
const style = document.createElement('style');
style.setAttribute('type', 'text/css');
style.appendChild(document.createTextNode(styleFonts));
document.head.appendChild(style);

export default app;
