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

  // ../../node_modules/@finsweet/ts-utils/dist/webflow/css.js
  var RICH_TEXT_BLOCK_CSS_CLASS = "w-richtext";
  var HTML_EMBED_CSS_CLASS = "w-embed";

  // ../../node_modules/@finsweet/ts-utils/dist/webflow/getSiteId.js
  var getSiteId = () => document.documentElement.getAttribute("data-wf-site");

  // ../../node_modules/@finsweet/ts-utils/dist/webflow/restartWebflow.js
  var restartWebflow = async (modules) => {
    const { Webflow } = window;
    if (!Webflow || !("destroy" in Webflow) || !("ready" in Webflow) || !("require" in Webflow))
      return;
    if (modules && !modules.length)
      return;
    if (!modules) {
      Webflow.destroy();
      Webflow.ready();
    }
    if (!modules || modules.includes("ix2")) {
      const ix2 = Webflow.require("ix2");
      if (ix2) {
        const { store, actions } = ix2;
        const { eventState } = store.getState().ixSession;
        const stateEntries = Object.entries(eventState);
        if (!modules)
          ix2.destroy();
        ix2.init();
        await Promise.all(stateEntries.map((state) => store.dispatch(actions.eventStateChanged(...state))));
      }
    }
    if (!modules || modules.includes("commerce")) {
      const commerce = Webflow.require("commerce");
      const siteId = getSiteId();
      if (commerce && siteId) {
        commerce.destroy();
        commerce.init({ siteId, apiUrl: "https://render.webflow.com" });
      }
    }
    if (modules?.includes("lightbox"))
      Webflow.require("lightbox")?.ready();
    if (modules?.includes("slider"))
      Webflow.require("slider")?.redraw();
    if (modules?.includes("tabs"))
      Webflow.require("tabs")?.redraw();
    return new Promise((resolve) => Webflow.push(() => resolve(void 0)));
  };

  // ../../global/factory/selectors.ts
  var generateSelectors = (attributes) => {
    const getSelector3 = (name, valueKey, params) => {
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
    const queryElement3 = (elementKey, params) => {
      const selector = getSelector3("element", elementKey, params);
      return (params?.scope || document).querySelector(selector);
    };
    return [getSelector3, queryElement3];
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

  // src/utils/constants.ts
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
  var IGNORE_LINE_PREFIX = "&lt;!-- fs-richtext-ignore --&gt;";
  var DOMPURIFY_SRC = "https://cdn.jsdelivr.net/npm/dompurify@2/dist/purify.es.min.js";

  // src/utils/regex.ts
  var HAS_COMPONENT_TEMPLATE_REGEX = /\{\{.*?\}\}/;
  var IS_EXTERNAL_COMPONENT_REGEX = /\=\".*?\"/;
  var HAS_HTML_OPENING_TAG_REGEX = /\&lt\;.*?\&gt\;/;
  var IS_HTML_OPENING_TAG_REGEX = /^\&lt\;.*?\&gt\;$/;
  var TRAILING_SLASH_REGEX = /\/+$/;
  var MUSTACHE_DELIMITERS_REGEX = /(\{\{)|(\}\})/g;

  // src/actions/collect.ts
  var getValidTextElements = (element) => {
    const textElements = [...element.querySelectorAll("h1, h2, h3, h4, h5, h6, p, blockquote, li")];
    const filteredParagraphs = textElements.filter((paragraph) => {
      const { innerHTML } = paragraph;
      if (!innerHTML)
        return false;
      const mustIgnore = innerHTML.includes(IGNORE_LINE_PREFIX);
      const hasComponent = HAS_COMPONENT_TEMPLATE_REGEX.test(innerHTML);
      const hasTag = HAS_HTML_OPENING_TAG_REGEX.test(innerHTML);
      const isEmbed = paragraph.closest(`.${HTML_EMBED_CSS_CLASS}`);
      if (mustIgnore) {
        paragraph.innerHTML = innerHTML.replace(IGNORE_LINE_PREFIX, "");
        return false;
      }
      return (hasTag || hasComponent) && !isEmbed;
    });
    return filteredParagraphs;
  };

  // src/actions/components.ts
  var componentsStore = [];
  var { origin, href: currentHref } = window.location;
  var getComponentHTML = async (rawHTML) => {
    const [componentDefinition] = rawHTML.match(HAS_COMPONENT_TEMPLATE_REGEX) || [];
    if (!componentDefinition)
      return;
    const rawComponentKey = componentDefinition.replace(MUSTACHE_DELIMITERS_REGEX, "").trim();
    const isExternal = IS_EXTERNAL_COMPONENT_REGEX.test(rawComponentKey);
    if (!isExternal) {
      const component2 = await queryComponent(rawComponentKey);
      return component2?.outerHTML;
    }
    const [componentKey] = rawComponentKey.split('="');
    const [rawSource] = rawComponentKey.match(IS_EXTERNAL_COMPONENT_REGEX) || [];
    if (!componentKey || !rawSource)
      return;
    const source = parseComponentSource(rawSource);
    const component = await queryComponent(componentKey, source);
    return component?.outerHTML;
  };
  var parseComponentSource = (rawSource) => {
    let source = rawSource.replace('="', "").replace('"', "").trim();
    if (source.startsWith("/"))
      source = origin.replace(TRAILING_SLASH_REGEX, "") + source;
    const { href: sourceHref } = new URL(source);
    const validSource = currentHref !== sourceHref;
    if (validSource)
      return source;
  };
  var queryComponent = async (componentKey, source) => {
    const storedComponent = componentsStore.find((data) => data.componentKey === componentKey && data.source === source);
    if (storedComponent)
      return storedComponent.element;
    let externalDocument;
    if (source) {
      try {
        const response = await fetch(source);
        const data = await response.text();
        const parser = new DOMParser();
        externalDocument = parser.parseFromString(data, "text/html");
      } catch (error) {
        Debug.alert(`[${source}] is not a valid source.`, "error");
        return;
      }
    }
    const element = (externalDocument || document).querySelector(`[${ATTRIBUTES2.component.key}="${componentKey}"]`);
    if (!element)
      Debug.alert(`No components were found with the [${componentKey}] key.`, "info");
    if (element) {
      componentsStore.push({
        element,
        componentKey,
        source
      });
      element.remove();
    }
    return element;
  };

  // src/actions/html.ts
  var unescapeHTML = (rawHTML) => {
    return rawHTML.replace(/(&nbsp;)/g, " ").replace(/(&lt;)/g, "<").replace(/(&gt;)/g, ">").replace(/(&amp;)/g, "&").replace(/(&quot;)/g, '"').replace(/(&#96;)/g, "`").replace(/(&#x27;)/g, "'");
  };

  // src/actions/sanitize.ts
  var DOMPurify;
  var importDOMPurify = async () => {
    if (DOMPurify)
      return DOMPurify;
    try {
      const module = await import(DOMPURIFY_SRC);
      DOMPurify = module.default;
      return DOMPurify;
    } catch (error) {
      Debug.alert("There was an issue while importing DOMPurify.", "info");
      return;
    }
  };
  var sanitizeHTML = async (rawHTML) => {
    const DOMPurify2 = await importDOMPurify();
    if (!DOMPurify2)
      return "";
    return DOMPurify2.sanitize(rawHTML);
  };

  // src/actions/parse.ts
  var parseTextElement = async (textElement, sanitize) => {
    const { innerHTML } = textElement;
    const isComponent = HAS_COMPONENT_TEMPLATE_REGEX.test(innerHTML);
    if (isComponent) {
      const componentHTML = await getComponentHTML(innerHTML);
      if (componentHTML)
        textElement.outerHTML = componentHTML;
      return;
    }
    const isTag = textElement.tagName === "P" && IS_HTML_OPENING_TAG_REGEX.test(innerHTML.trim());
    const unescapedHTML = unescapeHTML(innerHTML);
    textElement[isTag ? "outerHTML" : "innerHTML"] = sanitize ? await sanitizeHTML(unescapedHTML) : unescapedHTML;
  };

  // src/init.ts
  var {
    sanitize: { key: sanitizeKey, values: sanitizeValues },
    resetIx: { key: resetIxKey, values: resetIxValues }
  } = ATTRIBUTES2;
  var init = async () => {
    const rtbElements = [
      ...document.querySelectorAll(`.${RICH_TEXT_BLOCK_CSS_CLASS}${getSelector2("element", "richText", { operator: "prefixed" })}`)
    ];
    await Promise.all(rtbElements.map(initRtbElement));
    window.fsAttributes[ATTRIBUTE].resolve?.(rtbElements);
  };
  var initRtbElement = async (element) => {
    const sanitize = element.getAttribute(sanitizeKey) === sanitizeValues.true;
    const resetIx = element.getAttribute(resetIxKey) === resetIxValues.true;
    const textElements = getValidTextElements(element);
    await Promise.all(textElements.map((textElement) => parseTextElement(textElement, sanitize)));
    if (resetIx)
      await restartWebflow(["ix2"]);
  };

  // src/index.ts
  initAttributes();
  var { currentScript } = document;
  var { preventsLoad } = assessScript(currentScript);
  if (preventsLoad)
    window.fsAttributes[ATTRIBUTE] = { init };
  else {
    window.Webflow ||= [];
    window.Webflow.push(init);
  }
})();
//# sourceMappingURL=richtext.js.map
