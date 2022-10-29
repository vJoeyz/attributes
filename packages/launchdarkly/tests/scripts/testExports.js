"use strict";
(() => {
  // ../../node_modules/.pnpm/superstruct@0.16.5/node_modules/superstruct/lib/index.mjs
  var StructError = class extends TypeError {
    constructor(failure, failures) {
      let cached;
      const {
        message,
        ...rest
      } = failure;
      const {
        path
      } = failure;
      const msg = path.length === 0 ? message : `At path: ${path.join(".")} -- ${message}`;
      super(msg);
      this.value = void 0;
      this.key = void 0;
      this.type = void 0;
      this.refinement = void 0;
      this.path = void 0;
      this.branch = void 0;
      this.failures = void 0;
      Object.assign(this, rest);
      this.name = this.constructor.name;
      this.failures = () => {
        return cached ?? (cached = [failure, ...failures()]);
      };
    }
  };
  function isIterable(x) {
    return isObject(x) && typeof x[Symbol.iterator] === "function";
  }
  function isObject(x) {
    return typeof x === "object" && x != null;
  }
  function print(value) {
    return typeof value === "string" ? JSON.stringify(value) : `${value}`;
  }
  function shiftIterator(input) {
    const {
      done,
      value
    } = input.next();
    return done ? void 0 : value;
  }
  function toFailure(result, context, struct, value) {
    if (result === true) {
      return;
    } else if (result === false) {
      result = {};
    } else if (typeof result === "string") {
      result = {
        message: result
      };
    }
    const {
      path,
      branch
    } = context;
    const {
      type: type2
    } = struct;
    const {
      refinement,
      message = `Expected a value of type \`${type2}\`${refinement ? ` with refinement \`${refinement}\`` : ""}, but received: \`${print(value)}\``
    } = result;
    return {
      value,
      type: type2,
      refinement,
      key: path[path.length - 1],
      path,
      branch,
      ...result,
      message
    };
  }
  function* toFailures(result, context, struct, value) {
    if (!isIterable(result)) {
      result = [result];
    }
    for (const r of result) {
      const failure = toFailure(r, context, struct, value);
      if (failure) {
        yield failure;
      }
    }
  }
  function* run(value, struct, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      path = [],
      branch = [value],
      coerce = false,
      mask: mask2 = false
    } = options;
    const ctx = {
      path,
      branch
    };
    if (coerce) {
      value = struct.coercer(value, ctx);
      if (mask2 && struct.type !== "type" && isObject(struct.schema) && isObject(value) && !Array.isArray(value)) {
        for (const key in value) {
          if (struct.schema[key] === void 0) {
            delete value[key];
          }
        }
      }
    }
    let status = "valid";
    for (const failure of struct.validator(value, ctx)) {
      status = "not_valid";
      yield [failure, void 0];
    }
    for (let [k, v, s] of struct.entries(value, ctx)) {
      const ts = run(v, s, {
        path: k === void 0 ? path : [...path, k],
        branch: k === void 0 ? branch : [...branch, v],
        coerce,
        mask: mask2
      });
      for (const t of ts) {
        if (t[0]) {
          status = t[0].refinement != null ? "not_refined" : "not_valid";
          yield [t[0], void 0];
        } else if (coerce) {
          v = t[1];
          if (k === void 0) {
            value = v;
          } else if (value instanceof Map) {
            value.set(k, v);
          } else if (value instanceof Set) {
            value.add(v);
          } else if (isObject(value)) {
            if (v !== void 0)
              value[k] = v;
          }
        }
      }
    }
    if (status !== "not_valid") {
      for (const failure of struct.refiner(value, ctx)) {
        status = "not_refined";
        yield [failure, void 0];
      }
    }
    if (status === "valid") {
      yield [void 0, value];
    }
  }
  var Struct = class {
    constructor(props) {
      this.TYPE = void 0;
      this.type = void 0;
      this.schema = void 0;
      this.coercer = void 0;
      this.validator = void 0;
      this.refiner = void 0;
      this.entries = void 0;
      const {
        type: type2,
        schema,
        validator,
        refiner,
        coercer = (value) => value,
        entries = function* () {
        }
      } = props;
      this.type = type2;
      this.schema = schema;
      this.entries = entries;
      this.coercer = coercer;
      if (validator) {
        this.validator = (value, context) => {
          const result = validator(value, context);
          return toFailures(result, context, this, value);
        };
      } else {
        this.validator = () => [];
      }
      if (refiner) {
        this.refiner = (value, context) => {
          const result = refiner(value, context);
          return toFailures(result, context, this, value);
        };
      } else {
        this.refiner = () => [];
      }
    }
    assert(value) {
      return assert(value, this);
    }
    create(value) {
      return create(value, this);
    }
    is(value) {
      return is(value, this);
    }
    mask(value) {
      return mask(value, this);
    }
    validate(value, options) {
      if (options === void 0) {
        options = {};
      }
      return validate(value, this, options);
    }
  };
  function assert(value, struct) {
    const result = validate(value, struct);
    if (result[0]) {
      throw result[0];
    }
  }
  function create(value, struct) {
    const result = validate(value, struct, {
      coerce: true
    });
    if (result[0]) {
      throw result[0];
    } else {
      return result[1];
    }
  }
  function mask(value, struct) {
    const result = validate(value, struct, {
      coerce: true,
      mask: true
    });
    if (result[0]) {
      throw result[0];
    } else {
      return result[1];
    }
  }
  function is(value, struct) {
    const result = validate(value, struct);
    return !result[0];
  }
  function validate(value, struct, options) {
    if (options === void 0) {
      options = {};
    }
    const tuples = run(value, struct, options);
    const tuple = shiftIterator(tuples);
    if (tuple[0]) {
      const error = new StructError(tuple[0], function* () {
        for (const t of tuples) {
          if (t[0]) {
            yield t[0];
          }
        }
      });
      return [error, void 0];
    } else {
      const v = tuple[1];
      return [void 0, v];
    }
  }
  function define(name, validator) {
    return new Struct({
      type: name,
      schema: null,
      validator
    });
  }
  function boolean() {
    return define("boolean", (value) => {
      return typeof value === "boolean";
    });
  }
  function optional(struct) {
    return new Struct({
      ...struct,
      validator: (value, ctx) => value === void 0 || struct.validator(value, ctx),
      refiner: (value, ctx) => value === void 0 || struct.refiner(value, ctx)
    });
  }
  function record(Key, Value) {
    return new Struct({
      type: "record",
      schema: null,
      *entries(value) {
        if (isObject(value)) {
          for (const k in value) {
            const v = value[k];
            yield [k, k, Key];
            yield [k, v, Value];
          }
        }
      },
      validator(value) {
        return isObject(value) || `Expected an object, but received: ${print(value)}`;
      }
    });
  }
  function string() {
    return define("string", (value) => {
      return typeof value === "string" || `Expected a string, but received: ${print(value)}`;
    });
  }
  function type(schema) {
    const keys = Object.keys(schema);
    return new Struct({
      type: "type",
      schema,
      *entries(value) {
        if (isObject(value)) {
          for (const k of keys) {
            yield [k, value[k], schema[k]];
          }
        }
      },
      validator(value) {
        return isObject(value) || `Expected an object, but received: ${print(value)}`;
      }
    });
  }

  // ../../global/constants/attributes.ts
  var LAUNCHDARKLY_ATTRIBUTE = "launchdarkly";

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.37.1/node_modules/@finsweet/ts-utils/dist/type-guards/instances.js
  var isHTMLInputElement = (target) => target instanceof HTMLInputElement;
  var isHTMLSelectElement = (target) => target instanceof HTMLSelectElement;
  var isHTMLTextAreaElement = (target) => target instanceof HTMLTextAreaElement;
  var isHTMLButtonElement = (target) => target instanceof HTMLButtonElement;

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.37.1/node_modules/@finsweet/ts-utils/dist/type-guards/isKeyOf.js
  var isKeyOf = (key, source) => !!key && source.includes(key);

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.37.1/node_modules/@finsweet/ts-utils/dist/type-guards/primitives.js
  var isString = (value) => typeof value === "string";
  var isNumber = (value) => typeof value === "number";
  var isBoolean = (value) => typeof value === "boolean";

  // ../../node_modules/.pnpm/@finsweet+ts-utils@0.37.1/node_modules/@finsweet/ts-utils/dist/helpers/extractCommaSeparatedValues.js
  function extractCommaSeparatedValues(string2, compareSource, defaultValue, filterEmpty = true) {
    const emptyValue = defaultValue ? [defaultValue] : [];
    if (!string2)
      return emptyValue;
    const items = string2.split(",").reduce((accumulatedValue, currentValue) => {
      const value = currentValue.trim();
      if (!filterEmpty || value)
        accumulatedValue.push(value);
      return accumulatedValue;
    }, []);
    if (compareSource) {
      const matches = items.filter((item) => isKeyOf(item, compareSource));
      return matches.length ? matches : emptyValue;
    }
    return items;
  }

  // ../../global/factory/selectors.ts
  var generateSelectors = (attributes) => {
    const getSelector2 = (name, valueKey, params) => {
      const attribute = attributes[name];
      const { key: attributeKey, values } = attribute;
      let attributeValue;
      if (!valueKey)
        return `[${attributeKey}]`;
      const value = values?.[valueKey];
      if (isString(value))
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
    function queryElement2(elementKey, params) {
      const selector = getSelector2("element", elementKey, params);
      const scope = params?.scope || document;
      return params?.all ? [...scope.querySelectorAll(selector)] : scope.querySelector(selector);
    }
    const getAttribute = (element, settingKey) => {
      const attribute = attributes[settingKey];
      if (!attribute)
        return null;
      return element.getAttribute(attribute.key);
    };
    return [getSelector2, queryElement2, getAttribute];
  };

  // src/utils/constants.ts
  var ATTRIBUTES_PREFIX = `fs-${LAUNCHDARKLY_ATTRIBUTE}`;
  var LOADER_ELEMENT_KEY = "loader";
  var DEV_CLIENT_ID_SETTING_KEY = `devclientid`;
  var PROD_CLIENT_ID_SETTING_KEY = `prodclientid`;
  var EVENTS_TO_TRACK_SETTING_KEY = `eventstotrack`;
  var FLAG_SETTING_KEY = `flag`;
  var SHOW_IF_SETTING_KEY = `showif`;
  var SET_PROPERTIES_SETTING_KEY = `setproperties`;
  var CLOAK_SETTING_KEY = `cloak`;
  var ATTRIBUTES = {
    element: {
      key: `${ATTRIBUTES_PREFIX}-element`,
      values: {
        loader: LOADER_ELEMENT_KEY
      }
    },
    devClientId: {
      key: `${ATTRIBUTES_PREFIX}-${DEV_CLIENT_ID_SETTING_KEY}`
    },
    prodClientId: {
      key: `${ATTRIBUTES_PREFIX}-${PROD_CLIENT_ID_SETTING_KEY}`
    },
    eventsToTrack: {
      key: `${ATTRIBUTES_PREFIX}-${EVENTS_TO_TRACK_SETTING_KEY}`
    },
    flag: {
      key: `${ATTRIBUTES_PREFIX}-${FLAG_SETTING_KEY}`
    },
    showIf: {
      key: `${ATTRIBUTES_PREFIX}-${SHOW_IF_SETTING_KEY}`
    },
    setProperties: {
      key: `${ATTRIBUTES_PREFIX}-${SET_PROPERTIES_SETTING_KEY}`
    },
    cloak: {
      key: `${ATTRIBUTES_PREFIX}-${CLOAK_SETTING_KEY}`
    }
  };
  var [getSelector, queryElement] = generateSelectors(ATTRIBUTES);
  var TEXT_PROPERTY = `text`;
  var SRC_PROPERTY = `src`;
  var SRCSET_PROPERTY = `srcset`;
  var SIZES_PROPERTY = `sizes`;
  var VALUE_PROPERTY = `value`;
  var CLASS_PROPERTY = `class`;
  var HTML_PROPERTY = `html`;
  var jsonFlagValueSchema = type({
    show: optional(boolean()),
    properties: optional(record(string(), string()))
  });
  var IS_STAGING = window.location.origin.includes("webflow.io");

  // src/actions/loaders.ts
  var hideLoaders = () => {
    const allElements = queryElement("loader", { all: true });
    for (const element of allElements) {
      element.style.display = "none";
    }
  };

  // src/utils/type-guards.ts
  var PROPERTIES_TYPE_GUARDS = {
    [VALUE_PROPERTY](element) {
      return isHTMLInputElement(element) || isHTMLButtonElement(element) || isHTMLSelectElement(element) || isHTMLTextAreaElement(element);
    }
  };

  // src/actions/properties.ts
  var updateElementProperty = (element, properties, value) => {
    const propertiesToUpdate = Array.isArray(properties) ? properties : [properties];
    for (const property of propertiesToUpdate) {
      propertyActions[property]?.(element, value);
    }
  };
  var propertyActions = {
    [TEXT_PROPERTY]: (element, value) => {
      element.innerText = String(value);
    },
    [SRC_PROPERTY]: (element, value) => {
      const iframe = element.querySelector("iframe");
      if (iframe) {
        iframe.src = String(value);
        return;
      }
      element.setAttribute(SRC_PROPERTY, String(value));
      element.removeAttribute(SRCSET_PROPERTY);
    },
    [SRCSET_PROPERTY]: (element, value) => {
      element.setAttribute(SRCSET_PROPERTY, String(value));
      element.removeAttribute(SRC_PROPERTY);
    },
    [SIZES_PROPERTY]: (element, value) => {
      element.setAttribute(SIZES_PROPERTY, String(value));
    },
    [VALUE_PROPERTY]: (element, value) => {
      if (PROPERTIES_TYPE_GUARDS[VALUE_PROPERTY](element)) {
        element.value = String(value);
      }
    },
    [CLASS_PROPERTY]: (element, value) => {
      element.classList.add(String(value));
    },
    [HTML_PROPERTY]: (element, value) => {
      element.innerHTML = String(value);
    }
  };

  // src/factory.ts
  var initFlags = (flags) => {
    const allFlagElements = document.querySelectorAll(getSelector("flag"));
    for (const element of allFlagElements) {
      initFlagElement(element, flags);
      element.removeAttribute(ATTRIBUTES.cloak.key);
    }
  };
  var initFlagElement = (element, flags) => {
    const flagName = element.getAttribute(ATTRIBUTES.flag.key);
    if (!flagName)
      return;
    const rawFlagValue = flags[flagName];
    const rawShowIf = element.getAttribute(ATTRIBUTES.showIf.key);
    const rawSetProperties = element.getAttribute(ATTRIBUTES.setProperties.key);
    if (is(rawFlagValue, jsonFlagValueSchema)) {
      initJSON(element, rawFlagValue);
      return;
    }
    const flagValue = isString(rawFlagValue) || isNumber(rawFlagValue) || isBoolean(rawFlagValue) ? String(rawFlagValue) : void 0;
    if (rawShowIf) {
      initShowIf(element, rawShowIf, flagValue);
    }
    if (rawSetProperties && flagValue) {
      initSetProperties(element, rawSetProperties, flagValue);
    }
  };
  var initShowIf = (element, rawShowIf, flagValue) => {
    const showConditions = extractCommaSeparatedValues(rawShowIf);
    const show = !!flagValue && showConditions.includes(flagValue);
    if (!show) {
      element.remove();
    }
  };
  var initSetProperties = (element, rawSetProperties, flagValue) => {
    const properties = extractCommaSeparatedValues(rawSetProperties);
    updateElementProperty(element, properties, flagValue);
  };
  var initJSON = (element, { show, properties }) => {
    if (show === false) {
      element.remove();
    }
    if (properties) {
      for (const key in properties) {
        updateElementProperty(element, key, properties[key]);
      }
    }
  };

  // src/testExports.ts
  window.fsLaunchDarkly = {
    initFlags,
    hideLoaders
  };
})();
//# sourceMappingURL=testExports.js.map
