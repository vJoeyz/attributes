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

  // ../../node_modules/@finsweet/ts-utils/dist/helpers/extractNumberSuffix.js
  var extractNumberSuffix = (string) => {
    const splitValue = string.split("-");
    const suffix = parseInt(splitValue[splitValue.length - 1]);
    if (!isNaN(suffix))
      return suffix;
  };

  // ../../global/factory/selectors.ts
  var generateDynamicAttibuteValue = (value) => {
    return (index) => `${value}${index ? `-${index}` : ""}`;
  };
  var generateSelectors = (attributes) => {
    const getSelector3 = (name, valueKey, params) => {
      const attribute2 = attributes[name];
      const { key: attributeKey, values } = attribute2;
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
  var assessScript = () => {
    const { currentScript } = document;
    const { preventLoad, debugMode } = ATTRIBUTES;
    const preventsLoad2 = typeof currentScript?.getAttribute(preventLoad.key) === "string";
    if (typeof currentScript?.getAttribute(debugMode.key) === "string")
      Debug.activateAlerts();
    return { preventsLoad: preventsLoad2 };
  };

  // ../../global/import/support.ts
  var ATTRIBUTES_SUPPORT_QUERY_PARAM = `${ATTRIBUTES_PREFIX}-support`;
  var ATTRIBUTES_SUPPORT_SOURCE = "https://cdn.jsdelivr.net/npm/@finsweet/attributes-support@1/support.js";
  var importSupport = async () => {
    const { fsAttributes, location } = window;
    const { host, searchParams } = new URL(location.href);
    if (!host.includes("webflow.io") || !searchParams.has(ATTRIBUTES_SUPPORT_QUERY_PARAM))
      return false;
    if (fsAttributes.supportImport)
      return fsAttributes.supportImport;
    try {
      fsAttributes.supportImport = new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = ATTRIBUTES_SUPPORT_SOURCE;
        script.onload = () => resolve(true);
        script.onerror = reject;
        document.head.append(script);
      });
    } catch (error) {
      return false;
    }
    return fsAttributes.supportImport;
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
    importSupport();
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
      const attribute2 = fsAttributes[attributeName];
      attribute2.loading = new Promise((resolve) => {
        attribute2.resolve = (value) => {
          resolve(value);
          delete attribute2.resolve;
        };
      });
    }
  };
  var runExistingCallbacks = (fsAttributes) => {
    const existingCallbacks = Array.isArray(window.fsAttributes) ? window.fsAttributes : [];
    fsAttributes.push(...existingCallbacks);
  };

  // package.json
  var version = "1.0.0";

  // ../../global/helpers/instances.ts
  var getInstanceIndex = (element, attributeKey) => {
    const elementValue = element.getAttribute(attributeKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : void 0;
    return instanceIndex;
  };

  // src/utils/constants.ts
  var ATTRIBUTE = "toc";
  var ATTRIBUTES_PREFIX2 = `fs-${ATTRIBUTE}`;
  var CONTENTS_ELEMENT_KEY = "contents";
  var LINK_ELEMENT_KEY = "link";
  var IX_TRIGGER_ELEMENT_KEY = "ix-trigger";
  var HEADINGS = ["h1", "h2", "h3", "h4", "h5", "h6"];
  var HEADING_SETTING_KEY = "heading";
  var HEADING_SETTING_VALUES = Object.fromEntries(HEADINGS.map((heading) => [heading, heading]));
  var ATTRIBUTES2 = {
    element: {
      key: `${ATTRIBUTES_PREFIX2}-element`,
      values: {
        contents: generateDynamicAttibuteValue(CONTENTS_ELEMENT_KEY),
        link: generateDynamicAttibuteValue(LINK_ELEMENT_KEY),
        ixTrigger: IX_TRIGGER_ELEMENT_KEY
      }
    },
    heading: {
      key: `${ATTRIBUTES_PREFIX2}-${HEADING_SETTING_KEY}`,
      values: HEADING_SETTING_VALUES
    }
  };
  var [getSelector2, queryElement2] = generateSelectors(ATTRIBUTES2);

  // src/utils/helpers.ts
  var extractHeadingLevel = (value) => {
    const rawLevel = value.match(/\d/)?.[0];
    if (!rawLevel)
      return;
    const level = parseInt(rawLevel);
    if (isNaN(level))
      return;
    return level;
  };

  // src/actions/collect.ts
  var collectHeadingsData = (contentsElement) => {
    const headingsData = [];
    const levelsMemo = [];
    const headingElements = contentsElement.querySelectorAll(HEADINGS.join(","));
    for (const headingElement of headingElements) {
      const { tagName } = headingElement;
      const level = extractHeadingLevel(tagName);
      if (!level)
        continue;
      const headingData = {
        level,
        headingElement,
        children: []
      };
      let levelMemo;
      for (let i = levelsMemo.length - 1; i >= 0; i--) {
        levelMemo = levelsMemo[i];
        if (level > levelMemo.level)
          break;
        levelsMemo.pop();
      }
      if (!levelMemo) {
        headingsData.push(headingData);
        levelsMemo.push(headingData);
        continue;
      }
      levelMemo.children.push(headingData);
      if (level > levelMemo.level)
        levelsMemo.push(headingData);
    }
    return headingsData;
  };

  // src/init.ts
  var init = () => {
    const contentsElements = document.querySelectorAll(getSelector2("element", "contents", { operator: "prefixed" }));
    for (const contentsElement of contentsElements) {
      const instanceIndex = getInstanceIndex(contentsElement, ATTRIBUTES2.element.key);
      const linkTemplate = queryElement2("link", { instanceIndex });
      if (!linkTemplate)
        continue;
      const headingsData = collectHeadingsData(contentsElement);
      const templateLinksData = collectTemplateLinksData(linkTemplate);
      if (!headingsData.length || !templateLinksData)
        continue;
      console.log({ linkTemplate, headingsData, templateLinksData });
    }
  };
  var collectTemplateLinksData = (linkTemplate) => {
    const linksData = [];
    const collectLinkData = (referenceNode) => {
      const linkElement = referenceNode.closest("a");
      if (!linkElement)
        return;
      const { parentElement: parentElement2 } = linkElement;
      if (!parentElement2)
        return;
      const previousLevel = linksData[linksData.length - 1]?.level;
      const subsequentLevel = previousLevel ? previousLevel + 1 : 2;
      const rawLevel = referenceNode.getAttribute(ATTRIBUTES2.heading.key);
      let level = rawLevel ? extractHeadingLevel(rawLevel) : subsequentLevel;
      if (!level)
        return;
      if (linksData.find((linkData) => linkData.level === level))
        level = subsequentLevel;
      const ixTrigger = parentElement2.querySelector(`:scope > ${ATTRIBUTES2.element.values.ixTrigger}`);
      linksData.push({
        linkElement,
        level,
        parentElement: parentElement2,
        ixTrigger
      });
      const followingTextNodes = [...parentElement2.querySelectorAll(`* ${getSelector2("element", "link")}`)];
      const followingTextNode = followingTextNodes.find((node) => node !== referenceNode);
      if (followingTextNode)
        collectLinkData(followingTextNode);
    };
    collectLinkData(linkTemplate);
    if (!linksData.length)
      return;
    const [{ parentElement }] = linksData;
    const tableWrapper = parentElement.parentElement;
    if (!tableWrapper)
      return;
    return [linksData, tableWrapper];
  };

  // src/index.ts
  initAttributes();
  window.fsAttributes[ATTRIBUTE] ||= {};
  var { preventsLoad } = assessScript();
  var attribute = window.fsAttributes[ATTRIBUTE];
  attribute.version = version;
  if (preventsLoad)
    attribute.init = init;
  else {
    window.Webflow ||= [];
    window.Webflow.push(init);
  }
})();
//# sourceMappingURL=toc.js.map
