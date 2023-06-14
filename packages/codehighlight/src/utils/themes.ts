export const WEBFLOW_THEME = /* css */ `
pre {
    display: block;
    position: relative;
    background-color: #404040;
    color: #d2d2d2;
    font-family: monospace !important;
    font-weight: 400;
    font-size: 0.875rem;
    padding: 1rem 1rem 1rem;
    border-radius: 0.375rem;
    margin: 0;
  }
  .hljs {
    display: block;
    overflow-x: auto;
    padding: 1rem;
    background-color: #2b2b2b;
  }
  .hljs::-webkit-scrollbar {
    height: 0.9375rem;
    background-color: transparent;
    border-top: 0.0625rem solid black;
  }
  .hljs::-webkit-scrollbar-thumb {
    background-color: #4d4d4d;
  }
  .hljs::-webkit-scrollbar-track {
    background-color: transparent;
  }
  .hljs-keyword {
    color: #c792ea;
  }
  .hljs-built_in {
    color: #82b1ff;
    font-style: italic;
  }
  .hljs-type {
    color: #82aaff;
  }
  .hljs-literal {
    color: #ff5874;
  }
  .hljs-number {
    color: #f77669;
  }
  .hljs-regexp {
    color: #5ca7e4;
  }
  .hljs-string {
    color: #c3e88d;
  }
  .hljs-subst {
    color: #d3423e;
  }
  .hljs-symbol {
    color: #82aaff;
  }
  .hljs-class {
    color: #ffcb8b;
  }
  .hljs-function {
    color: #82aaff;
  }
  .hljs-title {
    color: #80cbae;
  }
  .hljs-params {
    color: #e9eded;
  }
  .hljs-comment {
    color: #546e7a;
  }
  .hljs-doctag {
    color: #7fdbca;
  }
  .hljs-meta {
    color: #c792ea;
  }
  .hljs-meta-keyword {
    color: #82aaff;
  }
  .hljs-meta-string {
    color: #ecc48d;
  }
  .hljs-section {
    color: #82b1ff;
  }
  .hljs-builtin-name,
  .hljs-name,
  .hljs-tag {
    color: #80cbc4;
  }
  .hljs-attr {
    color: #ffcb6b;
  }
  .hljs-attribute {
    color: #ffcb6b;
  }
  .hljs-variable {
    color: #82b1ff;
  }
  .hljs-bullet {
    color: #d9f5dd;
  }
  .hljs-code {
    color: #80cbc4;
  }
  .hljs-emphasis {
    color: #c792ea;
    font-style: italic;
  }
  .hljs-strong {
    color: #addb67;
    font-weight: 700;
  }
  .hljs-formula {
    color: #c792ea;
  }
  .hljs-link {
    color: #ff869a;
  }
  .hljs-quote {
    color: #697098;
    font-style: italic;
  }
  .hljs-selector-tag {
    color: #ff6363;
  }
  .hljs-selector-id {
    color: #fad430;
  }
  .hljs-selector-class {
    color: #decb6b;
  }
  .hljs-selector-attr,
  .hljs-selector-pseudo {
    color: #c792ea;
    font-style: italic;
  }
  .hljs-template-tag {
    color: #c792ea;
  }
  .hljs-template-variable {
    color: #addb67;
  }
  .hljs-addition {
    color: #addb67ff;
    font-style: italic;
  }
  .hljs-deletion {
    color: #ef535090;
    font-style: italic;
  }
  .hljs-property {
    color: #80cbae;
  }
  
  /* Header */
  .snippetHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
  }
  
  /* Copy Button */
  .copyCodeBtn {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    background: #2b2b2b;
    color: #fff;
    border: 0.0625rem solid #636363;
    border-radius: 0rem;
    padding: 0.625rem 0.875rem;
    font-family: monospace;
    font-size: 1rem;
    line-height: 1.25;
    outline: none;
    transition: all 0.15s ease;
  }
  .copyCodeBtn:hover {
    background: #000;
    cursor: pointer;
  }
  .copyCodeBtn:active {
    transform: scale(0.98);
    background: #2b2b2b;
  }
  
  /* Code Title */
  .codeTitle {
    font-family: Inter, -apple-system, system-ui, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', sans-serif;
    font-size: 1rem;
    font-weight: normal;
    color: #d9d9d9;
    line-height: 1.25;
  }  
`;
