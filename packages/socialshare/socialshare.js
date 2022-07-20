(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

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

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.33.1/node_modules/@finsweet/ts-utils/dist/helpers/extractNumberSuffix.js
  var extractNumberSuffix = (string) => {
    const splitValue = string.split("-");
    const suffix = parseInt(splitValue[splitValue.length - 1]);
    if (!isNaN(suffix))
      return suffix;
  };

  // ../../global/constants/attributes.ts
  var ATTRIBUTES_PREFIX = "fs-attributes";

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
    function queryElement3(elementKey2, params) {
      const selector = getSelector3("element", elementKey2, params);
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

  // ../../node_modules/@finsweet/ts-utils/dist/webflow/css.js
  var CMS_CSS_CLASSES = {
    wrapper: "w-dyn-list",
    list: "w-dyn-items",
    item: "w-dyn-item",
    paginationWrapper: "w-pagination-wrapper",
    paginationNext: "w-pagination-next",
    paginationPrevious: "w-pagination-previous",
    pageCount: "w-page-count",
    emptyState: "w-dyn-empty"
  };

  // ../../global/helpers/instances.ts
  var getInstanceIndex = (element, attributeKey) => {
    const elementValue = element.getAttribute(attributeKey);
    const instanceIndex = elementValue ? extractNumberSuffix(elementValue) : void 0;
    return instanceIndex;
  };

  // src/utils/constants.ts
  var ATTRIBUTE = "socialshare";
  var ATTRIBUTES_PREFIX2 = `fs-${ATTRIBUTE}`;
  var FACEBOOK_ELEMENT_KEY = "facebook";
  var TWITTER_ELEMENT_KEY = "twitter";
  var PINTEREST_ELEMENT_KEY = "pinterest";
  var LINKEDIN_ELEMENT_KEY = "linkedin";
  var TELEGRAM_ELEMENT_KEY = "telegram";
  var REDDIT_ELEMENT_KEY = "reddit";
  var CONTENT_ELEMENT_KEY = "content";
  var URL_ELEMENT_KEY = "url";
  var FACEBOOK_HASHTAG_ELEMENT_KEY = "facebook-hashtags";
  var TWITTER_HASHTAG_ELEMENT_KEY = "twitter-hashtags";
  var TWITTER_USERNAME_ELEMENT_KEY = "twitter-username";
  var PINTEREST_IMAGE_ELEMENT_KEY = "pinterest-image";
  var PINTEREST_DESCRIPTION_ELEMENT_KEY = "pinterest-description";
  var WIDTH_SETTING_KEY = "width";
  var DEFAULT_WIDTH_SETTING_KEY = 600;
  var HEIGHT_SETTING_KEY = "height";
  var DEFAULT_HEIGHT_SETTING_KEY = 480;
  var ATTRIBUTES2 = {
    element: {
      key: `${ATTRIBUTES_PREFIX2}-element`,
      values: {
        facebook: generateDynamicAttibuteValue(FACEBOOK_ELEMENT_KEY),
        twitter: generateDynamicAttibuteValue(TWITTER_ELEMENT_KEY),
        pinterest: generateDynamicAttibuteValue(PINTEREST_ELEMENT_KEY),
        linkedin: generateDynamicAttibuteValue(LINKEDIN_ELEMENT_KEY),
        telegram: generateDynamicAttibuteValue(TELEGRAM_ELEMENT_KEY),
        reedit: generateDynamicAttibuteValue(REDDIT_ELEMENT_KEY),
        content: generateDynamicAttibuteValue(CONTENT_ELEMENT_KEY),
        url: generateDynamicAttibuteValue(URL_ELEMENT_KEY),
        facebookHashtags: generateDynamicAttibuteValue(FACEBOOK_HASHTAG_ELEMENT_KEY),
        twitterHashtags: generateDynamicAttibuteValue(TWITTER_HASHTAG_ELEMENT_KEY),
        twitterUsername: generateDynamicAttibuteValue(TWITTER_USERNAME_ELEMENT_KEY),
        pinterestImage: generateDynamicAttibuteValue(PINTEREST_IMAGE_ELEMENT_KEY),
        pinterestDescription: generateDynamicAttibuteValue(PINTEREST_DESCRIPTION_ELEMENT_KEY)
      }
    },
    width: {
      key: `${ATTRIBUTES_PREFIX2}-${HEIGHT_SETTING_KEY}`,
      default: DEFAULT_WIDTH_SETTING_KEY
    },
    height: {
      key: `${ATTRIBUTES_PREFIX2}-${WIDTH_SETTING_KEY}`,
      default: DEFAULT_HEIGHT_SETTING_KEY
    }
  };
  var [getSelector2, queryElement2] = generateSelectors(ATTRIBUTES2);

  // src/actions/collect.ts
  function collectFacebookData(instanceIndex, scope) {
    const facebookButton = collectSocialData("facebook", instanceIndex, scope);
    if (facebookButton === null) {
      return null;
    }
    const hashtagsElement = queryElement2("facebookHashtags", { instanceIndex, operator: "prefixed", scope });
    const hashtagsText = hashtagsElement ? hashtagsElement.innerText : null;
    return {
      ...facebookButton,
      type: "facebook",
      hashtags: hashtagsText
    };
  }
  function collectTwitterData(instanceIndex, scope) {
    const twitterButton = collectSocialData("twitter", instanceIndex, scope);
    if (twitterButton === null) {
      return null;
    }
    const hashtagsElement = queryElement2("twitterHashtags", { instanceIndex, operator: "prefixed", scope });
    const hashtagsText = hashtagsElement ? hashtagsElement.innerText : null;
    const usernameElement = queryElement2("twitterUsername", { instanceIndex, operator: "prefixed", scope });
    const userNameText = usernameElement ? usernameElement.innerText : null;
    return {
      ...twitterButton,
      type: "twitter",
      hashtags: hashtagsText,
      username: userNameText
    };
  }
  function collectPinterestData(instanceIndex, scope) {
    const pinterestButton = collectSocialData("pinterest", instanceIndex, scope);
    if (pinterestButton === null) {
      return null;
    }
    const imageElement = queryElement2("pinterestImage", { instanceIndex, operator: "prefixed", scope });
    const imageText = imageElement ? imageElement.innerText : null;
    const descriptionElement = queryElement2("pinterestDescription", {
      instanceIndex,
      operator: "prefixed",
      scope
    });
    const descriptioText = descriptionElement ? descriptionElement.innerText : null;
    return {
      ...pinterestButton,
      type: "pinterest",
      image: imageText,
      description: descriptioText
    };
  }
  function collectSocialData(elementKey2, instanceIndex, scope) {
    const socialShareButton = queryElement2(elementKey2, { instanceIndex, operator: "prefixed", scope });
    if (!socialShareButton) {
      return null;
    }
    const width = collectSize(socialShareButton, ATTRIBUTES2.width.key, ATTRIBUTES2.width.default);
    const height = collectSize(socialShareButton, ATTRIBUTES2.height.key, ATTRIBUTES2.height.default);
    return {
      button: socialShareButton,
      width,
      height,
      type: elementKey2
    };
  }
  function collectSize(button, selector, defaultValue) {
    const buttonWidth = button.getAttribute(selector);
    if (buttonWidth) {
      return parseInt(buttonWidth);
    }
    const closestElementWidth = button.closest(`[${selector}]`);
    if (!closestElementWidth) {
      return defaultValue;
    }
    const closestWidth = closestElementWidth.getAttribute(selector);
    if (!closestWidth) {
      return defaultValue;
    }
    return parseInt(closestWidth);
  }

  // src/factory.ts
  var FACEBOOK_URL = "https://www.facebook.com/sharer/sharer.php";
  var TWITTER_URL = "https://twitter.com/intent/tweet/";
  var PINTEREST_URL = "https://www.pinterest.com/pin/create/button/";
  var REDDIT_URL = "https://www.reddit.com/submit";
  var LINKEDIN_URL = "https://www.linkedin.com//sharing/share-offsite";
  var TELEGRAM_URL = "https://t.me/share";
  function socialShareFactory(content, url, facebook, twitter, pinterest, reddit, telegram, linkedin) {
    if (facebook) {
      createSocialShare(facebook.button, FACEBOOK_URL, { u: url, hashtag: facebook.hashtags, quote: content }, facebook.width, facebook.height);
    }
    if (twitter) {
      createSocialShare(twitter.button, TWITTER_URL, {
        text: content,
        via: twitter.username,
        hashtags: twitter.hashtags,
        url
      }, twitter.width, twitter.height);
    }
    if (pinterest) {
      createSocialShare(pinterest.button, PINTEREST_URL, {
        url,
        media: pinterest.image,
        description: pinterest.description
      }, pinterest.width, pinterest.height);
    }
    if (reddit) {
      createSocialShare(reddit.button, REDDIT_URL, {
        url,
        title: content
      }, reddit.width, reddit.height);
    }
    if (telegram) {
      createSocialShare(telegram.button, TELEGRAM_URL, {
        text: content,
        url
      }, telegram.width, telegram.height);
    }
    if (linkedin) {
      createSocialShare(linkedin.button, LINKEDIN_URL, { url }, linkedin.width, linkedin.height);
    }
  }
  function createSocialShare(button, urlSocialMedia, params, width, height) {
    button.addEventListener("click", function() {
      const notNullParams = Object.keys(params).filter((paramKey) => params[paramKey] !== null).reduce((newParams, paramKey) => {
        return {
          ...newParams,
          [paramKey]: params[paramKey]
        };
      }, {});
      const urlParams = new URLSearchParams(notNullParams).toString();
      const shareUrl = urlSocialMedia + (urlParams ? "?" + urlParams : "");
      const left = window.innerWidth / 2 - width / 2 + window.screenX;
      const top = window.innerHeight / 2 - height / 2 + window.screenY;
      const popParams = `scrollbars=no, width=${width}, height=${height}, top=${top}, left=${left}`;
      const newWindow = window.open(shareUrl, "", popParams);
      if (newWindow) {
        newWindow.focus();
      }
    });
  }

  // src/init.ts
  var {
    element: { key: elementKey }
  } = ATTRIBUTES2;
  var init = () => {
    const contentElements = queryElement2("content", { operator: "prefixed", all: true });
    contentElements.forEach((contentElement) => {
      const instanceIndex = getInstanceIndex(contentElement, elementKey);
      const cmsListItem = contentElement.closest(`.${CMS_CSS_CLASSES.item}`) || void 0;
      const urlElement = queryElement2("url", { operator: "prefixed", scope: cmsListItem });
      const facebook = collectFacebookData(instanceIndex, cmsListItem);
      const twitter = collectTwitterData(instanceIndex, cmsListItem);
      const pinterest = collectPinterestData(instanceIndex, cmsListItem);
      const reddit = collectSocialData("reedit", instanceIndex, cmsListItem);
      const linkedin = collectSocialData("linkedin", instanceIndex, cmsListItem);
      const telegram = collectSocialData("telegram", instanceIndex, cmsListItem);
      const contentText = contentElement.innerText;
      const contentUrl = urlElement ? urlElement.innerText : window.location.href;
      socialShareFactory(contentText, contentUrl, facebook, twitter, pinterest, reddit, telegram, linkedin);
    });
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
//# sourceMappingURL=socialshare.js.map
