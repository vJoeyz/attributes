(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../../node_modules/@finsweet/ts-utils/dist/components/Debug.js
  var Debug = class {
    static activateAlerts() {
      this.alertsActivated = true;
    }
    static alert(text, type) {
      if (this.alertsActivated)
        window.alert(text);
      if (type === "error")
        throw new Error(text);
    }
  };
  __publicField(Debug, "alertsActivated", false);

  // ../../global/factory/selectors.ts
  var generateSelectors = (attributes) => {
    const getSelector4 = (name, valueKey, params) => {
      const attribute = attributes[name];
      const { key: attributeKey, values } = attribute;
      let attributeValue;
      if (!valueKey)
        return `[${attributeKey}]`;
      const value = values?.[valueKey];
      if (typeof value === "string")
        attributeValue = value;
      else
        attributeValue = value(params && "instanceIndex" in params ? params.instanceIndex : void 0);
      if (!params?.operator)
        return `[${attributeKey}="${attributeValue}"]`;
      switch (params.operator) {
        case "prefixed":
          return `[${attributeKey}^="${attributeValue}"]`;
        case "suffixed":
          return `[${attributeKey}$="${attributeValue}"]`;
        case "contains":
          return `[${attributeKey}*="${attributeValue}"]`;
      }
    };
    const queryElement4 = (elementKey, params) => {
      const selector = getSelector4("element", elementKey, params);
      return (params?.scope || document).querySelector(selector);
    };
    return [getSelector4, queryElement4];
  };

  // ../../global/constants/attributes.ts
  var ATTRIBUTES_PREFIX = "fs-attributes";
  var ATTRIBUTES = {
    preventLoad: { key: `${ATTRIBUTES_PREFIX}-preventload` },
    debugMode: { key: `${ATTRIBUTES_PREFIX}-debug` },
    src: { key: "src", values: { finsweet: "@finsweet/attributes" } },
    dev: { key: `${ATTRIBUTES_PREFIX}-dev` }
  };
  var [getSelector, queryElement] = generateSelectors(ATTRIBUTES);

  // ../../global/factory/assess.ts
  var assessScript = (script) => {
    const { preventLoad, debugMode } = ATTRIBUTES;
    const preventsLoad2 = typeof script?.getAttribute(preventLoad.key) === "string";
    if (typeof script?.getAttribute(debugMode.key) === "string")
      Debug.activateAlerts();
    return { preventsLoad: preventsLoad2 };
  };

  // ../../global/factory/init.ts
  var initAttributes = () => {
    if (window.fsAttributes && !Array.isArray(window.fsAttributes))
      return;
    const fsAttributes = {
      cms: {},
      push(...args) {
        for (const [attributeName, callback] of args)
          this[attributeName]?.loading?.then(callback);
      }
    };
    initLoadPromises(fsAttributes);
    runExistingCallbacks(fsAttributes);
    window.fsAttributes = fsAttributes;
    window.FsAttributes = window.fsAttributes;
  };
  var initLoadPromises = (fsAttributes) => {
    const srcSelector = getSelector("src", "finsweet", { operator: "contains" });
    const devSelector = getSelector("dev");
    const scripts = [...document.querySelectorAll(`script${srcSelector}, script${devSelector}`)];
    const attributes = scripts.reduce((acc, script) => {
      const attributeName = script.getAttribute(ATTRIBUTES.dev.key) || script.src.match(/[\w-. ]+(?=(\.js)$)/)?.[0];
      if (attributeName && !acc.includes(attributeName))
        acc.push(attributeName);
      return acc;
    }, []);
    for (const attributeName of attributes) {
      fsAttributes[attributeName] = {};
      const attribute = fsAttributes[attributeName];
      attribute.loading = new Promise((resolve) => {
        attribute.resolve = (value) => {
          resolve(value);
          delete attribute.resolve;
        };
      });
    }
  };
  var runExistingCallbacks = (fsAttributes) => {
    const existingCallbacks = Array.isArray(window.fsAttributes) ? window.fsAttributes : [];
    for (const callback of existingCallbacks)
      fsAttributes.push(callback);
  };

  // ../richtext/src/utils/constants.ts
  var ATTRIBUTE = "richtext";
  var ATTRIBUTES_PREFIX2 = `fs-${ATTRIBUTE}`;
  var RICH_TEXT_ELEMENT_KEY = "rich-text";
  var COMPONENT_SETTING_KEY = "component";
  var SANITIZE_SETTING_KEY = "sanitize";
  var RESET_IX_SETTING_KEY = "reset-ix";
  var ATTRIBUTES2 = {
    element: {
      key: `${ATTRIBUTES_PREFIX2}-element`,
      values: {
        richText: RICH_TEXT_ELEMENT_KEY
      }
    },
    component: { key: `${ATTRIBUTES_PREFIX2}-${COMPONENT_SETTING_KEY}` },
    sanitize: { key: `${ATTRIBUTES_PREFIX2}-${SANITIZE_SETTING_KEY}`, values: { true: "true" } },
    resetIx: { key: `${ATTRIBUTES_PREFIX2}-${RESET_IX_SETTING_KEY}`, values: { true: "true" } }
  };
  var [getSelector2, queryElement2] = generateSelectors(ATTRIBUTES2);

  // src/utils/constants.ts
  var ATTRIBUTE2 = "codehighlight";
  var ATTRIBUTES_PREFIX3 = `fs-${ATTRIBUTE2}`;
  var CODE_ELEMENT_KEY = "code";
  var THEME_SETTING_KEY = "theme";
  var ATTRIBUTES3 = {
    element: {
      key: `${ATTRIBUTES_PREFIX3}-element`,
      values: {
        code: CODE_ELEMENT_KEY
      }
    },
    theme: {
      key: `${ATTRIBUTES_PREFIX3}-${THEME_SETTING_KEY}`
    }
  };
  var [getSelector3, queryElement3] = generateSelectors(ATTRIBUTES3);
  var HIGHLIGHTJS_VERISON = "11.4.0";

  // src/actions/import.ts
  var hljsImport;
  var importHighlightJS = async (theme) => {
    if (hljsImport)
      return hljsImport;
    const script = document.createElement("script");
    script.setAttribute("src", `//cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHTJS_VERISON}/build/highlight.min.js`);
    let link;
    if (theme) {
      link = document.createElement("link");
      link.setAttribute("rel", "stylesheet");
      link.setAttribute("href", `//cdn.jsdelivr.net/gh/highlightjs/cdn-release@${HIGHLIGHTJS_VERISON}/build/styles/${theme}.min.css`);
    }
    const loadPromise = new Promise((resolve) => {
      let linkLoaded = !link;
      let scriptLoaded = false;
      const checkFulfill = () => {
        if (linkLoaded && scriptLoaded)
          resolve(void 0);
      };
      script.onload = () => {
        scriptLoaded = true;
        checkFulfill();
      };
      if (link) {
        link.onload = () => {
          linkLoaded = true;
          checkFulfill();
        };
      }
    });
    hljsImport = loadPromise;
    document.head.append(script);
    if (link)
      document.head.append(link);
    return loadPromise;
  };

  // src/init.ts
  var init = async () => {
    await window.fsAttributes[ATTRIBUTE]?.loading;
    const referenceElements = [
      ...document.querySelectorAll(getSelector3("element", "code", { operator: "prefixed" }))
    ];
    const theme = referenceElements.reduce((theme2, referenceElement) => {
      theme2 ||= referenceElement.getAttribute(ATTRIBUTES3.theme.key);
      return theme2;
    }, null);
    await importHighlightJS(theme);
    const codeElements = referenceElements.map(initHighlight);
    window.fsAttributes[ATTRIBUTE2].resolve?.(codeElements);
  };
  var initHighlight = (referenceElement) => {
    const codeElement = referenceElement.tagName === "CODE" ? referenceElement : referenceElement.querySelector("code");
    if (!codeElement)
      return;
    window.hljs.highlightElement(codeElement);
    return codeElement;
  };

  // src/index.ts
  initAttributes();
  var { currentScript } = document;
  var { preventsLoad } = assessScript(currentScript);
  if (preventsLoad)
    window.fsAttributes[ATTRIBUTE2] = { init };
  else {
    window.Webflow ||= [];
    window.Webflow.push(init);
  }
})();
//# sourceMappingURL=codehighlight.js.map
