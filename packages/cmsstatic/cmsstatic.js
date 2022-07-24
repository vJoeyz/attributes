(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // ../../global/constants/attributes.ts
  var ATTRIBUTES_PREFIX = "fs-attributes";
  var CMS_STATIC_ATTRIBUTE = "cmsstatic";

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.33.1/node_modules/@finsweet/ts-utils/dist/components/Debug.js
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
      const caseInsensitive = params && "caseInsensitive" in params && params.caseInsensitive ? "i" : "";
      if (!params?.operator)
        return `[${attributeKey}="${attributeValue}"${caseInsensitive}]`;
      switch (params.operator) {
        case "prefixed":
          return `[${attributeKey}^="${attributeValue}"${caseInsensitive}]`;
        case "suffixed":
          return `[${attributeKey}$="${attributeValue}"${caseInsensitive}]`;
        case "contains":
          return `[${attributeKey}*="${attributeValue}"${caseInsensitive}]`;
      }
    };
    function queryElement3(elementKey, params) {
      const selector = getSelector3("element", elementKey, params);
      const scope = params?.scope || document;
      return params?.all ? scope.querySelectorAll(selector) : scope.querySelector(selector);
    }
    return [getSelector3, queryElement3];
  };

  // ../../global/factory/constants.ts
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

  // ../cmscore/src/utils/import.ts
  var CMS_CORE_SOURCE = "http://localhost:3000/packages/cmscore/cmscore.js";
  var importCMSCore = async () => {
    const { fsAttributes } = window;
    fsAttributes.cms ||= {};
    const { cms } = fsAttributes;
    if (cms.coreImport)
      return cms.coreImport;
    try {
      const cmsCoreImport = import(CMS_CORE_SOURCE);
      cms.coreImport = cmsCoreImport;
      cmsCoreImport.then((cmsCore) => {
        if (cmsCore)
          cms.coreVersion ||= cmsCore.version;
      });
      return cmsCoreImport;
    } catch (error) {
      Debug.alert(`${error}`, "error");
      return;
    }
  };

  // src/utils/constants.ts
  var ATTRIBUTES_PREFIX2 = `fs-${CMS_STATIC_ATTRIBUTE}`;
  var LIST_ELEMENT_KEY = "list";
  var STATIC_ITEM_ELEMENT_KEY = "static-item";
  var ORDER_SETTING_KEY = "order";
  var ATTRIBUTES2 = {
    element: {
      key: `${ATTRIBUTES_PREFIX2}-element`,
      values: {
        list: generateDynamicAttibuteValue(LIST_ELEMENT_KEY),
        staticItem: generateDynamicAttibuteValue(STATIC_ITEM_ELEMENT_KEY)
      }
    },
    order: {
      key: `${ATTRIBUTES_PREFIX2}-${ORDER_SETTING_KEY}`
    }
  };
  var [getSelector2, queryElement2] = generateSelectors(ATTRIBUTES2);

  // src/factory.ts
  async function initStaticInstance(listInstance) {
    const staticElements = [...queryElement2("staticItem", { all: true })];
    for (const staticElement of staticElements) {
      const order = staticElement.getAttribute(ATTRIBUTES2.order.key);
      if (!order) {
        continue;
      }
      const orderNumber = parseInt(order);
      if (isNaN(orderNumber)) {
        continue;
      }
      await listInstance.addStaticItems(staticElement, orderNumber);
    }
  }

  // src/init.ts
  var init = async () => {
    const cmsCore = await importCMSCore();
    if (!cmsCore)
      return [];
    const listInstances = cmsCore.createCMSListInstances([getSelector2("element", "list", { operator: "prefixed" })]);
    await Promise.all(listInstances.map(initStaticInstance));
    window.fsAttributes[CMS_STATIC_ATTRIBUTE].resolve?.(listInstances);
    return listInstances;
  };

  // src/index.ts
  initAttributes();
  window.fsAttributes[CMS_STATIC_ATTRIBUTE] ||= {};
  var { preventsLoad } = assessScript();
  var attribute = window.fsAttributes[CMS_STATIC_ATTRIBUTE];
  attribute.version = version;
  if (preventsLoad)
    attribute.init = init;
  else {
    window.Webflow ||= [];
    window.Webflow.push(init);
  }
})();
//# sourceMappingURL=cmsstatic.js.map
