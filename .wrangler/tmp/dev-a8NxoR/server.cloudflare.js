var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw2) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw2 || cooked.slice()) }));

// .wrangler/tmp/bundle-Gfko8A/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then(
    (res) => Promise.all(
      res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))
    ).then(() => buffer[0])
  );
  if (preserveCallbacks) {
    return raw(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  Object.entries(map).forEach(([key, value]) => headers.set(key, value));
  return headers;
};
var Context = class {
  req;
  env = {};
  _var = {};
  finalized = false;
  error = void 0;
  #status = 200;
  #executionCtx;
  #headers = void 0;
  #preparedHeaders = void 0;
  #res;
  #isFresh = true;
  layout = void 0;
  renderer = (content) => this.html(content);
  notFoundHandler = () => new Response();
  constructor(req, options) {
    this.req = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      if (options.notFoundHandler) {
        this.notFoundHandler = options.notFoundHandler;
      }
    }
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      this.#res.headers.delete("content-type");
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => this.renderer(...args);
  setLayout = (layout) => this.layout = layout;
  getLayout = () => this.layout;
  setRenderer = (renderer) => {
    this.renderer = renderer;
  };
  header = (name, value, options) => {
    if (value === void 0) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this._var ??= {};
    this._var[key] = value;
  };
  get = (key) => {
    return this._var ? this._var[key] : void 0;
  };
  get var() {
    return { ...this._var };
  }
  newResponse = (data, arg, headers) => {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v, k) => {
          header.set(k, v);
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers();
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v, k) => {
        this.#headers?.set(k, v);
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        this.#headers.set(k, v);
      } else {
        this.#headers.delete(k);
        for (const v2 of v) {
          this.#headers.append(k, v2);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  };
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.newResponse(data, arg, headers) : this.newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    return typeof arg === "number" ? this.newResponse(text, arg, headers) : this.newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json; charset=UTF-8";
    return typeof arg === "number" ? this.newResponse(body, arg, headers) : this.newResponse(body, arg);
  };
  html = (html4, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html4 === "object") {
      if (!(html4 instanceof Promise)) {
        html4 = html4.toString();
      }
      if (html4 instanceof Promise) {
        return html4.then((html22) => resolveCallback(html22, HtmlEscapedCallbackPhase.Stringify, false, {})).then((html22) => {
          return typeof arg === "number" ? this.newResponse(html22, arg, headers) : this.newResponse(html22, arg);
        });
      }
    }
    return typeof arg === "number" ? this.newResponse(html4, arg, headers) : this.newResponse(html4, arg);
  };
  redirect = (location, status = 302) => {
    this.#headers ??= new Headers();
    this.#headers.set("Location", location);
    return this.newResponse(null, status);
  };
  notFound = () => {
    return this.notFoundHandler(this);
  };
};

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        if (context instanceof Context) {
          context.req.routeIndex = i;
        }
      } else {
        handler = i === middleware.length && next || void 0;
      }
      if (!handler) {
        if (context instanceof Context && context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      } else {
        try {
          res = await handler(context, () => {
            return dispatch(i + 1);
          });
        } catch (err) {
          if (err instanceof Error && context instanceof Context && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/http-exception.js
var HTTPException = class extends Error {
  res;
  status;
  constructor(status = 500, options) {
    super(options?.message, { cause: options?.cause });
    this.res = options?.res;
    this.status = status;
  }
  getResponse() {
    if (this.res) {
      return this.res;
    }
    return new Response(this.message, {
      status: this.status
    });
  }
};

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = { all: false }) => {
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (isFormDataContent(contentType)) {
    return parseFormData(request, options);
  }
  return {};
};
function isFormDataContent(contentType) {
  if (contentType === null) {
    return false;
  }
  return contentType.startsWith("multipart/form-data") || contentType.startsWith("application/x-www-form-urlencoded");
}
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = {};
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] && isArrayField(form[key])) {
    appendToExistingArray(form[key], value);
  } else if (form[key]) {
    convertToNewArray(form, key, value);
  } else {
    form[key] = value;
  }
};
function isArrayField(field) {
  return Array.isArray(field);
}
var appendToExistingArray = (arr, value) => {
  arr.push(value);
};
var convertToNewArray = (form, key, value) => {
  form[key] = [form[key], value];
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1; i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1; j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    if (!patternCache[label]) {
      if (match[2]) {
        patternCache[label] = [label, match[1], new RegExp("^" + match[2] + "$")];
      } else {
        patternCache[label] = [label, match[1], true];
      }
    }
    return patternCache[label];
  }
  return null;
};
var getPath = (request) => {
  const url = request.url;
  const queryIndex = url.indexOf("?", 8);
  return url.slice(url.indexOf("/", 8), queryIndex === -1 ? void 0 : queryIndex);
};
var getQueryStrings = (url) => {
  const queryIndex = url.indexOf("?", 8);
  return queryIndex === -1 ? "" : "?" + url.slice(queryIndex + 1);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result[result.length - 1] === "/" ? result.slice(0, -1) : result;
};
var mergePath = (...paths) => {
  let p = "";
  let endsWithSlash = false;
  for (let path of paths) {
    if (p[p.length - 1] === "/") {
      p = p.slice(0, -1);
      endsWithSlash = true;
    }
    if (path[0] !== "/") {
      path = `/${path}`;
    }
    if (path === "/" && endsWithSlash) {
      p = `${p}/`;
    } else if (path !== "/") {
      p = `${p}${path}`;
    }
    if (path === "/" && p === "") {
      p = "/";
    }
  }
  return p;
};
var checkOptionalParameter = (path) => {
  if (!path.match(/\:.+\?$/)) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return /%/.test(value) ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? void 0 : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return void 0;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(
      keyIndex + 1,
      valueIndex === -1 ? nextKeyIndex === -1 ? void 0 : nextKeyIndex : valueIndex
    );
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? void 0 : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      ;
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.getDecodedParam(key) : this.getAllDecodedParams();
  }
  getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.getParamValue(paramKey);
    return param ? /\%/.test(param) ? decodeURIComponent_(param) : param : void 0;
  }
  getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? decodeURIComponent_(value) : value;
      }
    }
    return decoded;
  }
  getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name.toLowerCase()) ?? void 0;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    if (this.bodyCache.parsedBody) {
      return this.bodyCache.parsedBody;
    }
    const parsedBody = await parseBody(this, options);
    this.bodyCache.parsedBody = parsedBody;
    return parsedBody;
  }
  cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    if (!bodyCache[key]) {
      for (const keyOfBodyCache of Object.keys(bodyCache)) {
        if (keyOfBodyCache === "parsedBody") {
          continue;
        }
        return (async () => {
          let body = await bodyCache[keyOfBodyCache];
          if (keyOfBodyCache === "json") {
            body = JSON.stringify(body);
          }
          return await new Response(body)[key]();
        })();
      }
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.cachedBody("json");
  }
  text() {
    return this.cachedBody("text");
  }
  arrayBuffer() {
    return this.cachedBody("arrayBuffer");
  }
  blob() {
    return this.cachedBody("blob");
  }
  formData() {
    return this.cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/hono-base.js
var COMPOSED_HANDLER = Symbol("composedHandler");
function defineDynamicClass() {
  return class {
  };
}
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class extends defineDynamicClass() {
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    super();
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          if (typeof handler !== "string") {
            this.addRoute(method, this.#path, handler);
          }
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      if (!method) {
        return this;
      }
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const strict = options.strict ?? true;
    delete options.strict;
    Object.assign(this, options);
    this.getPath = strict ? options.getPath ?? getPath : getPathNoStrict;
  }
  clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app2) {
    const subApp = this.basePath(path);
    if (!app2) {
      return subApp;
    }
    app2.routes.map((r2) => {
      let handler;
      if (app2.errorHandler === errorHandler) {
        handler = r2.handler;
      } else {
        handler = async (c, next) => (await compose([], app2.errorHandler)(c, () => r2.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r2.handler;
      }
      subApp.addRoute(r2.method, r2.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, optionHandler) {
    const mergedPath = mergePath(this._basePath, path);
    const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
    const handler = async (c, next) => {
      let executionContext = void 0;
      try {
        executionContext = c.executionCtx;
      } catch {
      }
      const options = optionHandler ? optionHandler(c) : [c.env, executionContext];
      const optionsArray = Array.isArray(options) ? options : [options];
      const queryStrings = getQueryStrings(c.req.url);
      const res = await applicationHandler(
        new Request(
          new URL((c.req.path.slice(pathPrefixLength) || "/") + queryStrings, c.req.url),
          c.req.raw
        ),
        ...optionsArray
      );
      if (res) {
        return res;
      }
      await next();
    };
    this.addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r2 = { path, method, handler };
    this.router.add(method, path, [handler, r2]);
    this.routes.push(r2);
  }
  matchRoute(method, path) {
    return this.router.match(method, path);
  }
  handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.matchRoute(method, path);
    const c = new Context(new HonoRequest(request, path, matchResult), {
      env,
      executionCtx,
      notFoundHandler: this.notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.notFoundHandler(c);
        });
      } catch (err) {
        return this.handleError(err, c);
      }
      return res instanceof Promise ? res.then(
        (resolved) => resolved || (c.finalized ? c.res : this.notFoundHandler(c))
      ).catch((err) => this.handleError(err, c)) : res;
    }
    const composed = compose(matchResult[0], this.errorHandler, this.notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error(
            "Context is not finalized. You may forget returning Response object or `await next()`"
          );
        }
        return context.res;
      } catch (err) {
        return this.handleError(err, c);
      }
    })();
  }
  fetch = (request, Env, executionCtx) => {
    return this.dispatch(request, executionCtx, Env, request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      if (requestInit !== void 0) {
        input = new Request(input, requestInit);
      }
      return this.fetch(input, Env, executionCtx);
    }
    input = input.toString();
    const path = /^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`;
    const req = new Request(path, requestInit);
    return this.fetch(req, Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.dispatch(event.request, event, void 0, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  index;
  varIndex;
  children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.index !== void 0) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.children[regexpStr];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[regexpStr] = new Node();
        if (name !== "") {
          node.varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.varIndex]);
      }
    } else {
      node = this.children[token];
      if (!node) {
        if (Object.keys(this.children).some(
          (k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR
        )) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.children[token] = new Node();
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.children[k];
      return (typeof c.varIndex === "number" ? `(${k})@${c.varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.index === "number") {
      strList.unshift(`#${this.index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  context = { varIndex: 0 };
  root = new Node();
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0; ; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1; i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1; j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.root.insert(tokens, index, paramAssoc, this.context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (typeof handlerIndex !== "undefined") {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (typeof paramIndex !== "undefined") {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(
    path === "*" ? "" : `^${path.replace(
      /\/\*$|([.\\+*[^\]$()])/g,
      (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)"
    )}$`
  );
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie();
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map(
    (route) => [!/\*|\/:/.test(route[0]), ...route]
  ).sort(
    ([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length
  );
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length; i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (; paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length; i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length; j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length; k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return void 0;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return void 0;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  middleware;
  routes;
  constructor() {
    this.middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const { middleware, routes } = this;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      ;
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach(
            (p) => re.test(p) && routes[m][p].push([handler, paramCount])
          );
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length; i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    [...Object.keys(this.routes), ...Object.keys(this.middleware)].forEach((method) => {
      matchers[method] ||= this.buildMatcher(method);
    });
    this.middleware = this.routes = void 0;
    return matchers;
  }
  buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.middleware, this.routes].forEach((r2) => {
      const ownRoute = r2[method] ? Object.keys(r2[method]).map((path) => [path, r2[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(
          ...Object.keys(r2[METHOD_NAME_ALL]).map((path) => [path, r2[METHOD_NAME_ALL][path]])
        );
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  routers = [];
  routes = [];
  constructor(init) {
    Object.assign(this, init);
  }
  add(method, path, handler) {
    if (!this.routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.routes) {
      throw new Error("Fatal error");
    }
    const { routers, routes } = this;
    const len = routers.length;
    let i = 0;
    let res;
    for (; i < len; i++) {
      const router = routers[i];
      try {
        routes.forEach((args) => {
          router.add(...args);
        });
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.routers = [router];
      this.routes = void 0;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.routes || this.routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var Node2 = class {
  methods;
  children;
  patterns;
  order = 0;
  name;
  params = /* @__PURE__ */ Object.create(null);
  constructor(method, handler, children) {
    this.children = children || /* @__PURE__ */ Object.create(null);
    this.methods = [];
    this.name = "";
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0, name: this.name };
      this.methods = [m];
    }
    this.patterns = [];
  }
  insert(method, path, handler) {
    this.name = `${method} ${path}`;
    this.order = ++this.order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length; i < len; i++) {
      const p = parts[i];
      if (Object.keys(curNode.children).includes(p)) {
        curNode = curNode.children[p];
        const pattern2 = getPattern(p);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.children[p] = new Node2();
      const pattern = getPattern(p);
      if (pattern) {
        curNode.patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.children[p];
    }
    if (!curNode.methods.length) {
      curNode.methods = [];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      name: this.name,
      score: this.order
    };
    m[method] = handlerSet;
    curNode.methods.push(m);
    return curNode;
  }
  gHSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.methods.length; i < len; i++) {
      const m = node.methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = /* @__PURE__ */ Object.create(null);
      if (handlerSet !== void 0) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSet.possibleKeys.forEach((key) => {
          const processed = processedSet[handlerSet.name];
          handlerSet.params[key] = params[key] && !processed ? params[key] : nodeParams[key] ?? params[key];
          processedSet[handlerSet.name] = true;
        });
        handlerSets.push(handlerSet);
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.params = /* @__PURE__ */ Object.create(null);
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    for (let i = 0, len = parts.length; i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length; j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.children[part];
        if (nextNode) {
          nextNode.params = node.params;
          if (isLast === true) {
            if (nextNode.children["*"]) {
              handlerSets.push(
                ...this.gHSets(nextNode.children["*"], method, node.params, /* @__PURE__ */ Object.create(null))
              );
            }
            handlerSets.push(...this.gHSets(nextNode, method, node.params, /* @__PURE__ */ Object.create(null)));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.patterns.length; k < len3; k++) {
          const pattern = node.patterns[k];
          const params = { ...node.params };
          if (pattern === "*") {
            const astNode = node.children["*"];
            if (astNode) {
              handlerSets.push(...this.gHSets(astNode, method, node.params, /* @__PURE__ */ Object.create(null)));
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp && matcher.test(restPathString)) {
            params[name] = restPathString;
            handlerSets.push(...this.gHSets(child, method, node.params, params));
            continue;
          }
          if (matcher === true || matcher instanceof RegExp && matcher.test(part)) {
            if (typeof key === "string") {
              params[name] = part;
              if (isLast === true) {
                handlerSets.push(...this.gHSets(child, method, params, node.params));
                if (child.children["*"]) {
                  handlerSets.push(...this.gHSets(child.children["*"], method, params, node.params));
                }
              } else {
                child.params = params;
                tempNodes.push(child);
              }
            }
          }
        }
      }
      curNodes = tempNodes;
    }
    const results = handlerSets.sort((a, b) => {
      return a.score - b.score;
    });
    return [results.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  node;
  constructor() {
    this.node = new Node2();
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (const p of results) {
        this.node.insert(method, p, handler);
      }
      return;
    }
    this.node.insert(method, path, handler);
  }
  match(method, path) {
    return this.node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter(), new TrieRouter()]
    });
  }
};

// node_modules/hono/dist/utils/color.js
function getColorEnabled() {
  const { process: process2, Deno } = globalThis;
  const isNoColor = typeof process2 !== "undefined" ? "NO_COLOR" in process2?.env : typeof Deno?.noColor === "boolean" ? Deno.noColor : false;
  return !isNoColor;
}

// node_modules/hono/dist/middleware/logger/index.js
var humanize = (times) => {
  const [delimiter, separator] = [",", "."];
  const orderTimes = times.map((v) => v.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + delimiter));
  return orderTimes.join(separator);
};
var time = (start) => {
  const delta = Date.now() - start;
  return humanize([delta < 1e3 ? delta + "ms" : Math.round(delta / 1e3) + "s"]);
};
var colorStatus = (status) => {
  const colorEnabled = getColorEnabled();
  const out = {
    7: colorEnabled ? `\x1B[35m${status}\x1B[0m` : `${status}`,
    5: colorEnabled ? `\x1B[31m${status}\x1B[0m` : `${status}`,
    4: colorEnabled ? `\x1B[33m${status}\x1B[0m` : `${status}`,
    3: colorEnabled ? `\x1B[36m${status}\x1B[0m` : `${status}`,
    2: colorEnabled ? `\x1B[32m${status}\x1B[0m` : `${status}`,
    1: colorEnabled ? `\x1B[32m${status}\x1B[0m` : `${status}`,
    0: colorEnabled ? `\x1B[33m${status}\x1B[0m` : `${status}`
  };
  const calculateStatus = status / 100 | 0;
  return out[calculateStatus];
};
function log(fn, prefix, method, path, status = 0, elapsed) {
  const out = prefix === "<--" ? `  ${prefix} ${method} ${path}` : `  ${prefix} ${method} ${path} ${colorStatus(status)} ${elapsed}`;
  fn(out);
}
var logger = (fn = console.log) => {
  return async function logger2(c, next) {
    const { method } = c.req;
    const path = getPath(c.req.raw);
    log(fn, "<--", method, path);
    const start = Date.now();
    await next();
    log(fn, "-->", method, path, c.res.status, time(start));
  };
};

// src/explore/database/database.json
var database_default = {
  teaser: [
    {
      title: "Classic Tractors",
      image: "/cdn/img/scene/[size]/classics.webp",
      url: "/products/classic"
    },
    {
      title: "Autonomous Tractors",
      image: "/cdn/img/scene/[size]/autonomous.webp",
      url: "/products/autonomous"
    }
  ],
  categories: [
    {
      key: "classic",
      name: "Classics",
      products: [
        {
          name: "Heritage Workhorse",
          id: "CL-01",
          image: "/cdn/img/product/[size]/CL-01-GR.webp",
          startPrice: 5700,
          url: "/product/CL-01"
        },
        {
          name: "Falcon Crest Farm",
          id: "CL-02",
          image: "/cdn/img/product/[size]/CL-02-BL.webp",
          startPrice: 2600,
          url: "/product/CL-02"
        },
        {
          name: "Falcon Crest Work",
          id: "CL-03",
          image: "/cdn/img/product/[size]/CL-03-GR.webp",
          startPrice: 2300,
          url: "/product/CL-03"
        },
        {
          name: "Broadfield Majestic",
          id: "CL-04",
          image: "/cdn/img/product/[size]/CL-04-BL.webp",
          startPrice: 2200,
          url: "/product/CL-04"
        },
        {
          name: "Countryside Commander",
          id: "CL-05",
          image: "/cdn/img/product/[size]/CL-05-PT.webp",
          startPrice: 2700,
          url: "/product/CL-05"
        },
        {
          name: "Danamark Steadfast",
          id: "CL-06",
          image: "/cdn/img/product/[size]/CL-06-MT.webp",
          startPrice: 2800,
          url: "/product/CL-06"
        },
        {
          name: "Greenland Rover",
          id: "CL-07",
          image: "/cdn/img/product/[size]/CL-07-GR.webp",
          startPrice: 2900,
          url: "/product/CL-07"
        },
        {
          name: "Holland Hamster",
          id: "CL-08",
          image: "/cdn/img/product/[size]/CL-08-GR.webp",
          startPrice: 7750,
          url: "/product/CL-08"
        },
        {
          name: "TerraFirma Veneto",
          id: "CL-09",
          image: "/cdn/img/product/[size]/CL-09-BL.webp",
          startPrice: 2950,
          url: "/product/CL-09"
        },
        {
          name: "Global Gallant",
          id: "CL-10",
          image: "/cdn/img/product/[size]/CL-10-SD.webp",
          startPrice: 2600,
          url: "/product/CL-10"
        },
        {
          name: "Scandinavia Sower",
          id: "CL-11",
          image: "/cdn/img/product/[size]/CL-11-SK.webp",
          startPrice: 3100,
          url: "/product/CL-11"
        },
        {
          name: "Celerity Cruiser",
          id: "CL-12",
          image: "/cdn/img/product/[size]/CL-12-BL.webp",
          startPrice: 3200,
          url: "/product/CL-12"
        },
        {
          name: "Rapid Racer",
          id: "CL-13",
          image: "/cdn/img/product/[size]/CL-13-BL.webp",
          startPrice: 7500,
          url: "/product/CL-13"
        },
        {
          name: "Caribbean Cruiser",
          id: "CL-14",
          image: "/cdn/img/product/[size]/CL-14-GR.webp",
          startPrice: 2300,
          url: "/product/CL-14"
        },
        {
          name: "Fieldmaster Classic",
          id: "CL-15",
          image: "/cdn/img/product/[size]/CL-15-PI.webp",
          startPrice: 6200,
          url: "/product/CL-15"
        }
      ]
    },
    {
      key: "autonomous",
      name: "Autonomous",
      products: [
        {
          name: "TerraFirma AutoCultivator T-300",
          id: "AU-01",
          image: "/cdn/img/product/[size]/AU-01-SI.webp",
          startPrice: 1e3,
          url: "/product/AU-01"
        },
        {
          name: "SmartFarm Titan",
          id: "AU-02",
          image: "/cdn/img/product/[size]/AU-02-OG.webp",
          startPrice: 4e3,
          url: "/product/AU-02"
        },
        {
          name: "FutureHarvest Navigator",
          id: "AU-03",
          image: "/cdn/img/product/[size]/AU-03-TQ.webp",
          startPrice: 1600,
          url: "/product/AU-03"
        },
        {
          name: "Sapphire Sunworker 460R",
          id: "AU-04",
          image: "/cdn/img/product/[size]/AU-04-RD.webp",
          startPrice: 8500,
          url: "/product/AU-04"
        },
        {
          name: "EcoGrow Crop Commander",
          id: "AU-05",
          image: "/cdn/img/product/[size]/AU-05-ZH.webp",
          startPrice: 3400,
          url: "/product/AU-05"
        },
        {
          name: "FarmFleet Sovereign",
          id: "AU-06",
          image: "/cdn/img/product/[size]/AU-06-CZ.webp",
          startPrice: 2100,
          url: "/product/AU-06"
        },
        {
          name: "Verde Voyager",
          id: "AU-07",
          image: "/cdn/img/product/[size]/AU-07-MT.webp",
          startPrice: 4e3,
          url: "/product/AU-07"
        },
        {
          name: "Field Pioneer",
          id: "AU-08",
          image: "/cdn/img/product/[size]/AU-08-WH.webp",
          startPrice: 4500,
          url: "/product/AU-08"
        }
      ]
    }
  ],
  recommendations: {
    "AU-01-SI": {
      name: "TerraFirma AutoCultivator T-300 Silver",
      sku: "AU-01-SI",
      image: "/cdn/img/product/[size]/AU-01-SI.webp",
      url: "/product/AU-01?sku=AU-01-SI",
      rgb: [
        192,
        192,
        192
      ]
    },
    "AU-02-OG": {
      name: "SmartFarm Titan Sunset Copper",
      sku: "AU-02-OG",
      image: "/cdn/img/product/[size]/AU-02-OG.webp",
      url: "/product/AU-02?sku=AU-02-OG",
      rgb: [
        221,
        82,
        25
      ]
    },
    "AU-02-BL": {
      name: "SmartFarm Titan Cosmic Sapphire",
      sku: "AU-02-BL",
      image: "/cdn/img/product/[size]/AU-02-BL.webp",
      url: "/product/AU-02?sku=AU-02-BL",
      rgb: [
        42,
        82,
        190
      ]
    },
    "AU-02-GG": {
      name: "SmartFarm Titan Verdant Shadow",
      sku: "AU-02-GG",
      image: "/cdn/img/product/[size]/AU-02-GG.webp",
      url: "/product/AU-02?sku=AU-02-GG",
      rgb: [
        0,
        90,
        4
      ]
    },
    "AU-03-TQ": {
      name: "FutureHarvest Navigator Turquoise Titan",
      sku: "AU-03-TQ",
      image: "/cdn/img/product/[size]/AU-03-TQ.webp",
      url: "/product/AU-03?sku=AU-03-TQ",
      rgb: [
        22,
        159,
        184
      ]
    },
    "AU-03-PL": {
      name: "FutureHarvest Navigator Majestic Violet",
      sku: "AU-03-PL",
      image: "/cdn/img/product/[size]/AU-03-PL.webp",
      url: "/product/AU-03?sku=AU-03-PL",
      rgb: [
        155,
        95,
        192
      ]
    },
    "AU-03-RD": {
      name: "FutureHarvest Navigator Scarlet Dynamo",
      sku: "AU-03-RD",
      image: "/cdn/img/product/[size]/AU-03-RD.webp",
      url: "/product/AU-03?sku=AU-03-RD",
      rgb: [
        255,
        36,
        0
      ]
    },
    "AU-03-YE": {
      name: "FutureHarvest Navigator Sunbeam Yellow",
      sku: "AU-03-YE",
      image: "/cdn/img/product/[size]/AU-03-YE.webp",
      url: "/product/AU-03?sku=AU-03-YE",
      rgb: [
        250,
        173,
        0
      ]
    },
    "AU-04-RD": {
      name: "Sapphire Sunworker 460R Ruby Red",
      sku: "AU-04-RD",
      image: "/cdn/img/product/[size]/AU-04-RD.webp",
      url: "/product/AU-04?sku=AU-04-RD",
      rgb: [
        155,
        17,
        30
      ]
    },
    "AU-04-BK": {
      name: "Sapphire Sunworker 460R Midnight Onyx",
      sku: "AU-04-BK",
      image: "/cdn/img/product/[size]/AU-04-BK.webp",
      url: "/product/AU-04?sku=AU-04-BK",
      rgb: [
        53,
        56,
        57
      ]
    },
    "AU-05-ZH": {
      name: "EcoGrow Crop Commander Zestful Horizon",
      sku: "AU-05-ZH",
      image: "/cdn/img/product/[size]/AU-05-ZH.webp",
      url: "/product/AU-05?sku=AU-05-ZH",
      rgb: [
        255,
        160,
        122
      ]
    },
    "AU-06-CZ": {
      name: "FarmFleet Sovereign Canary Zenith",
      sku: "AU-06-CZ",
      image: "/cdn/img/product/[size]/AU-06-CZ.webp",
      url: "/product/AU-06?sku=AU-06-CZ",
      rgb: [
        255,
        215,
        0
      ]
    },
    "AU-06-MT": {
      name: "FarmFleet Sovereign Minted Jade",
      sku: "AU-06-MT",
      image: "/cdn/img/product/[size]/AU-06-MT.webp",
      url: "/product/AU-06?sku=AU-06-MT",
      rgb: [
        98,
        136,
        130
      ]
    },
    "AU-07-MT": {
      name: "Verde Voyager Glacial Mint",
      sku: "AU-07-MT",
      image: "/cdn/img/product/[size]/AU-07-MT.webp",
      url: "/product/AU-07?sku=AU-07-MT",
      rgb: [
        175,
        219,
        210
      ]
    },
    "AU-07-YE": {
      name: "Verde Voyager Sunbeam Yellow",
      sku: "AU-07-YE",
      image: "/cdn/img/product/[size]/AU-07-YE.webp",
      url: "/product/AU-07?sku=AU-07-YE",
      rgb: [
        255,
        218,
        3
      ]
    },
    "AU-08-WH": {
      name: "Field Pioneer Polar White",
      sku: "AU-08-WH",
      image: "/cdn/img/product/[size]/AU-08-WH.webp",
      url: "/product/AU-08?sku=AU-08-WH",
      rgb: [
        232,
        232,
        232
      ]
    },
    "CL-01-GR": {
      name: "Heritage Workhorse Verdant Field",
      sku: "CL-01-GR",
      image: "/cdn/img/product/[size]/CL-01-GR.webp",
      url: "/product/CL-01?sku=CL-01-GR",
      rgb: [
        107,
        142,
        35
      ]
    },
    "CL-01-GY": {
      name: "Heritage Workhorse Stormy Sky",
      sku: "CL-01-GY",
      image: "/cdn/img/product/[size]/CL-01-GY.webp",
      url: "/product/CL-01?sku=CL-01-GY",
      rgb: [
        112,
        128,
        144
      ]
    },
    "CL-02-BL": {
      name: "Falcon Crest Farm Cerulean Classic",
      sku: "CL-02-BL",
      image: "/cdn/img/product/[size]/CL-02-BL.webp",
      url: "/product/CL-02?sku=CL-02-BL",
      rgb: [
        0,
        123,
        167
      ]
    },
    "CL-03-GR": {
      name: "Falcon Crest Work Meadow Green",
      sku: "CL-03-GR",
      image: "/cdn/img/product/[size]/CL-03-GR.webp",
      url: "/product/CL-03?sku=CL-03-GR",
      rgb: [
        124,
        252,
        0
      ]
    },
    "CL-03-PI": {
      name: "Falcon Crest Work Rustic Rose",
      sku: "CL-03-PI",
      image: "/cdn/img/product/[size]/CL-03-PI.webp",
      url: "/product/CL-03?sku=CL-03-PI",
      rgb: [
        181,
        0,
        24
      ]
    },
    "CL-03-YE": {
      name: "Falcon Crest Work Harvest Gold",
      sku: "CL-03-YE",
      image: "/cdn/img/product/[size]/CL-03-YE.webp",
      url: "/product/CL-03?sku=CL-03-YE",
      rgb: [
        218,
        145,
        0
      ]
    },
    "CL-04-BL": {
      name: "Broadfield Majestic Oceanic Blue",
      sku: "CL-04-BL",
      image: "/cdn/img/product/[size]/CL-04-BL.webp",
      url: "/product/CL-04?sku=CL-04-BL",
      rgb: [
        0,
        64,
        166
      ]
    },
    "CL-04-RD": {
      name: "Broadfield Majestic Rustic Crimson",
      sku: "CL-04-RD",
      image: "/cdn/img/product/[size]/CL-04-RD.webp",
      url: "/product/CL-04?sku=CL-04-RD",
      rgb: [
        123,
        63,
        0
      ]
    },
    "CL-04-TQ": {
      name: "Broadfield Majestic Aqua Green",
      sku: "CL-04-TQ",
      image: "/cdn/img/product/[size]/CL-04-TQ.webp",
      url: "/product/CL-04?sku=CL-04-TQ",
      rgb: [
        0,
        178,
        152
      ]
    },
    "CL-05-PT": {
      name: "Countryside Commander Pacific Teal",
      sku: "CL-05-PT",
      image: "/cdn/img/product/[size]/CL-05-PT.webp",
      url: "/product/CL-05?sku=CL-05-PT",
      rgb: [
        71,
        157,
        168
      ]
    },
    "CL-05-RD": {
      name: "Countryside Commander Barn Red",
      sku: "CL-05-RD",
      image: "/cdn/img/product/[size]/CL-05-RD.webp",
      url: "/product/CL-05?sku=CL-05-RD",
      rgb: [
        124,
        10,
        2
      ]
    },
    "CL-06-MT": {
      name: "Danamark Steadfast Emerald Forest",
      sku: "CL-06-MT",
      image: "/cdn/img/product/[size]/CL-06-MT.webp",
      url: "/product/CL-06?sku=CL-06-MT",
      rgb: [
        70,
        245,
        187
      ]
    },
    "CL-06-YE": {
      name: "Danamark Steadfast Golden Wheat",
      sku: "CL-06-YE",
      image: "/cdn/img/product/[size]/CL-06-YE.webp",
      url: "/product/CL-06?sku=CL-06-YE",
      rgb: [
        250,
        175,
        63
      ]
    },
    "CL-07-GR": {
      name: "Greenland Rover Forest Fern",
      sku: "CL-07-GR",
      image: "/cdn/img/product/[size]/CL-07-GR.webp",
      url: "/product/CL-07?sku=CL-07-GR",
      rgb: [
        46,
        162,
        80
      ]
    },
    "CL-07-YE": {
      name: "Greenland Rover Autumn Amber",
      sku: "CL-07-YE",
      image: "/cdn/img/product/[size]/CL-07-YE.webp",
      url: "/product/CL-07?sku=CL-07-YE",
      rgb: [
        255,
        191,
        0
      ]
    },
    "CL-08-GR": {
      name: "Holland Hamster Polder Green",
      sku: "CL-08-GR",
      image: "/cdn/img/product/[size]/CL-08-GR.webp",
      url: "/product/CL-08?sku=CL-08-GR",
      rgb: [
        194,
        178,
        128
      ]
    },
    "CL-08-PI": {
      name: "Holland Hamster Tulip Magenta",
      sku: "CL-08-PI",
      image: "/cdn/img/product/[size]/CL-08-PI.webp",
      url: "/product/CL-08?sku=CL-08-PI",
      rgb: [
        214,
        82,
        130
      ]
    },
    "CL-09-BL": {
      name: "TerraFirma Veneto Adriatic Blue",
      sku: "CL-09-BL",
      image: "/cdn/img/product/[size]/CL-09-BL.webp",
      url: "/product/CL-09?sku=CL-09-BL",
      rgb: [
        47,
        110,
        163
      ]
    },
    "CL-09-GR": {
      name: "TerraFirma Veneto Tuscan Green",
      sku: "CL-09-GR",
      image: "/cdn/img/product/[size]/CL-09-GR.webp",
      url: "/product/CL-09?sku=CL-09-GR",
      rgb: [
        81,
        139,
        43
      ]
    },
    "CL-10-SD": {
      name: "Global Gallant Sahara Dawn",
      sku: "CL-10-SD",
      image: "/cdn/img/product/[size]/CL-10-SD.webp",
      url: "/product/CL-10?sku=CL-10-SD",
      rgb: [
        184,
        168,
        117
      ]
    },
    "CL-10-VI": {
      name: "Global Gallant Violet Vintage",
      sku: "CL-10-VI",
      image: "/cdn/img/product/[size]/CL-10-VI.webp",
      url: "/product/CL-10?sku=CL-10-VI",
      rgb: [
        138,
        43,
        226
      ]
    },
    "CL-11-SK": {
      name: "Scandinavia Sower Baltic Blue",
      sku: "CL-11-SK",
      image: "/cdn/img/product/[size]/CL-11-SK.webp",
      url: "/product/CL-11?sku=CL-11-SK",
      rgb: [
        149,
        193,
        244
      ]
    },
    "CL-11-YE": {
      name: "Scandinavia Sower Nordic Gold",
      sku: "CL-11-YE",
      image: "/cdn/img/product/[size]/CL-11-YE.webp",
      url: "/product/CL-11?sku=CL-11-YE",
      rgb: [
        255,
        215,
        0
      ]
    },
    "CL-12-BL": {
      name: "Celerity Cruiser Velocity Blue",
      sku: "CL-12-BL",
      image: "/cdn/img/product/[size]/CL-12-BL.webp",
      url: "/product/CL-12?sku=CL-12-BL",
      rgb: [
        30,
        144,
        255
      ]
    },
    "CL-12-RD": {
      name: "Celerity Cruiser Rally Red",
      sku: "CL-12-RD",
      image: "/cdn/img/product/[size]/CL-12-RD.webp",
      url: "/product/CL-12?sku=CL-12-RD",
      rgb: [
        237,
        41,
        57
      ]
    },
    "CL-13-BL": {
      name: "Rapid Racer Speedway Blue",
      sku: "CL-13-BL",
      image: "/cdn/img/product/[size]/CL-13-BL.webp",
      url: "/product/CL-13?sku=CL-13-BL",
      rgb: [
        38,
        121,
        166
      ]
    },
    "CL-13-RD": {
      name: "Rapid Racer Raceway Red",
      sku: "CL-13-RD",
      image: "/cdn/img/product/[size]/CL-13-RD.webp",
      url: "/product/CL-13?sku=CL-13-RD",
      rgb: [
        207,
        16,
        32
      ]
    },
    "CL-14-GR": {
      name: "Caribbean Cruiser Emerald Grove",
      sku: "CL-14-GR",
      image: "/cdn/img/product/[size]/CL-14-GR.webp",
      url: "/product/CL-14?sku=CL-14-GR",
      rgb: [
        87,
        174,
        19
      ]
    },
    "CL-14-RD": {
      name: "Caribbean Cruiser Ruby Fields",
      sku: "CL-14-RD",
      image: "/cdn/img/product/[size]/CL-14-RD.webp",
      url: "/product/CL-14?sku=CL-14-RD",
      rgb: [
        205,
        43,
        30
      ]
    },
    "CL-15-PI": {
      name: "Fieldmaster Classic Vintage Pink",
      sku: "CL-15-PI",
      image: "/cdn/img/product/[size]/CL-15-PI.webp",
      url: "/product/CL-15?sku=CL-15-PI",
      rgb: [
        225,
        148,
        158
      ]
    },
    "CL-15-SD": {
      name: "Fieldmaster Classic Sahara Dust",
      sku: "CL-15-SD",
      image: "/cdn/img/product/[size]/CL-15-SD.webp",
      url: "/product/CL-15?sku=CL-15-SD",
      rgb: [
        222,
        199,
        140
      ]
    }
  },
  stores: [
    {
      id: "store-a",
      name: "Aurora Flagship Store",
      street: "Astronaut Way 1",
      city: "Arlington",
      image: "/cdn/img/store/[size]/store-1.webp"
    },
    {
      id: "store-b",
      name: "Big Micro Machines",
      street: "Broadway 2",
      city: "Burlington",
      image: "/cdn/img/store/[size]/store-2.webp"
    },
    {
      id: "store-c",
      name: "Central Mall",
      street: "Clown Street 3",
      city: "Cryo",
      image: "/cdn/img/store/[size]/store-3.webp"
    },
    {
      id: "store-d",
      name: "Downtown Model Store",
      street: "Duck Street 4",
      city: "Davenport",
      image: "/cdn/img/store/[size]/store-4.webp"
    }
  ]
};

// src/explore/database/index.js
var database_default2 = database_default;

// node_modules/hono/dist/utils/cookie.js
var validCookieNameRegEx = /^[\w!#$%&'*.^`|~+-]+$/;
var validCookieValueRegEx = /^[ !#-:<-[\]-~]*$/;
var parse = (cookie, name) => {
  const pairs = cookie.trim().split(";");
  return pairs.reduce((parsedCookie, pairStr) => {
    pairStr = pairStr.trim();
    const valueStartPos = pairStr.indexOf("=");
    if (valueStartPos === -1) {
      return parsedCookie;
    }
    const cookieName = pairStr.substring(0, valueStartPos).trim();
    if (name && name !== cookieName || !validCookieNameRegEx.test(cookieName)) {
      return parsedCookie;
    }
    let cookieValue = pairStr.substring(valueStartPos + 1).trim();
    if (cookieValue.startsWith('"') && cookieValue.endsWith('"')) {
      cookieValue = cookieValue.slice(1, -1);
    }
    if (validCookieValueRegEx.test(cookieValue)) {
      parsedCookie[cookieName] = decodeURIComponent_(cookieValue);
    }
    return parsedCookie;
  }, {});
};
var _serialize = (name, value, opt = {}) => {
  let cookie = `${name}=${value}`;
  if (name.startsWith("__Secure-") && !opt.secure) {
    throw new Error("__Secure- Cookie must have Secure attributes");
  }
  if (name.startsWith("__Host-")) {
    if (!opt.secure) {
      throw new Error("__Host- Cookie must have Secure attributes");
    }
    if (opt.path !== "/") {
      throw new Error('__Host- Cookie must have Path attributes with "/"');
    }
    if (opt.domain) {
      throw new Error("__Host- Cookie must not have Domain attributes");
    }
  }
  if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
    if (opt.maxAge > 3456e4) {
      throw new Error(
        "Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration."
      );
    }
    cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
  }
  if (opt.domain && opt.prefix !== "host") {
    cookie += `; Domain=${opt.domain}`;
  }
  if (opt.path) {
    cookie += `; Path=${opt.path}`;
  }
  if (opt.expires) {
    if (opt.expires.getTime() - Date.now() > 3456e7) {
      throw new Error(
        "Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future."
      );
    }
    cookie += `; Expires=${opt.expires.toUTCString()}`;
  }
  if (opt.httpOnly) {
    cookie += "; HttpOnly";
  }
  if (opt.secure) {
    cookie += "; Secure";
  }
  if (opt.sameSite) {
    cookie += `; SameSite=${opt.sameSite}`;
  }
  if (opt.partitioned) {
    if (!opt.secure) {
      throw new Error("Partitioned Cookie must have Secure attributes");
    }
    cookie += "; Partitioned";
  }
  return cookie;
};
var serialize = (name, value, opt) => {
  value = encodeURIComponent(value);
  return _serialize(name, value, opt);
};

// node_modules/hono/dist/helper/cookie/index.js
var getCookie = (c, key, prefix) => {
  const cookie = c.req.raw.headers.get("Cookie");
  if (typeof key === "string") {
    if (!cookie) {
      return void 0;
    }
    let finalKey = key;
    if (prefix === "secure") {
      finalKey = "__Secure-" + key;
    } else if (prefix === "host") {
      finalKey = "__Host-" + key;
    }
    const obj2 = parse(cookie, finalKey);
    return obj2[finalKey];
  }
  if (!cookie) {
    return {};
  }
  const obj = parse(cookie);
  return obj;
};
var setCookie = (c, name, value, opt) => {
  let cookie;
  if (opt?.prefix === "secure") {
    cookie = serialize("__Secure-" + name, value, { path: "/", ...opt, secure: true });
  } else if (opt?.prefix === "host") {
    cookie = serialize("__Host-" + name, value, {
      ...opt,
      path: "/",
      secure: true,
      domain: void 0
    });
  } else {
    cookie = serialize(name, value, { path: "/", ...opt });
  }
  c.header("set-cookie", cookie, { append: true });
};

// src/checkout/state.js
var ITEM_SEP = "|";
var QTY_SEP = "_";
var COOKIE = "c_cart";
function readFromCookie(c) {
  const cookieStr = getCookie(c, COOKIE);
  if (!cookieStr)
    return [];
  return cookieStr.split(ITEM_SEP).map((item) => {
    const [sku, quantity] = item.split(QTY_SEP);
    return { sku, quantity: parseInt(quantity, 10) };
  });
}
function writeToCookie(items, c) {
  const cookieStr = items.map((item) => `${item.sku}${QTY_SEP}${item.quantity}`).join(ITEM_SEP);
  console.log("writeToCookie", cookieStr);
  setCookie(c, COOKIE, cookieStr, { httpOnly: true });
}

// src/checkout/utils.js
var html = String.raw;
var IMAGE_SERVER = typeof process === "undefined" || process.env.USE_LOCAL_IMAGES !== "true" ? "https://blueprint.the-tractor.store" : "";
function src(image, size) {
  return IMAGE_SERVER + image.replace("[size]", `${size}`);
}
function srcset(image, sizes = []) {
  return sizes.map((size) => `${src(image, size)} ${size}w`).join(", ");
}

// src/checkout/components/Button.js
var Button_default = ({
  href,
  type,
  value,
  disabled,
  rounded,
  className = "",
  children,
  dataId,
  size = "normal",
  variant = "secondary",
  title
}) => {
  const tag = href ? "a" : "button";
  return html` <${tag}
    ${disabled ? "disabled" : ""}
    ${href ? `href="${href}"` : ""}
    ${type ? `type="${type}"` : ""}
    ${value ? `value="${value}"` : ""}
    ${dataId ? `data-id="${dataId}"` : ""}
    ${title ? `title="${title}"` : ""}
    class="c_Button c_Button--${variant} ${className} ${rounded ? "c_Button--rounded" : ""} c_Button--size-${size}"
  >
    <div class="c_Button__inner">${children}</div>
  </${tag}>`;
};

// src/checkout/components/MiniCart.js
var MiniCart_default = ({ c }) => {
  const lineItems = readFromCookie(c);
  const quantity = lineItems.reduce((t, { quantity: quantity2 }) => t + quantity2, 0);
  return html`<div class="c_MiniCart" data-boundary="checkout">
    ${Button_default({
    variant: "secondary",
    rounded: true,
    href: "/checkout/cart",
    className: "c_MiniCart__button",
    title: "View Cart",
    children: html`
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="33"
          height="33"
          viewBox="0 0 33 33"
          fill="none"
        >
          <g clip-path="url(#a)">
            <path
              fill="#000"
              d="M2.75 27.5c0 1.5125 1.2375 2.75 2.75 2.75h22c1.5125 0 2.75-1.2375 2.75-2.75V9.625h-6.3188c-.649-3.5145-3.7311-6.1875-7.4312-6.1875-3.7001 0-6.78219 2.673-7.43119 6.1875H2.75V27.5ZM16.5 4.8125c2.9391 0 5.4003 2.06113 6.028 4.8125H10.472c.6277-2.75137 3.0889-4.8125 6.028-4.8125ZM8.9375 11v4.125h1.375V11h12.375v4.125h1.375V11h4.8125v16.5c0 .7583-.6167 1.375-1.375 1.375h-22c-.75831 0-1.375-.6167-1.375-1.375V11h4.8125Z"
            />
          </g>
          <defs>
            <clipPath id="a"><path fill="#fff" d="M0 0h33v33H0z" /></clipPath>
          </defs>
        </svg>
        <div class="c_MiniCart__quantity">${quantity || ""}</div>
      `
  })}
  </div>`;
};

// src/explore/utils.js
var html2 = String.raw;
var IMAGE_SERVER2 = typeof process === "undefined" || process.env.USE_LOCAL_IMAGES !== "true" ? "https://blueprint.the-tractor.store" : "";
function src2(image, size) {
  return IMAGE_SERVER2 + image.replace("[size]", `${size}`);
}
function srcset2(image, sizes = []) {
  return sizes.map((size) => `${src2(image, size)} ${size}w`).join(", ");
}
function fmtprice(price) {
  return `${price},00 \xD8`;
}

// src/explore/components/Navigation.js
var Navigation_default = () => {
  return html2`<nav class="e_Navigation">
    <ul class="e_Navigation__list">
      <li class="e_Navigation__item"><a href="/products">Machines</a></li>
      <li class="e_Navigation__item"><a href="/stores">Stores</a></li>
    </ul>
  </nav>`;
};

// src/explore/components/Header.js
var Header_default = ({ c }) => {
  return html2`<header class="e_Header" data-boundary="explore">
    <div class="e_Header__cutter">
      <div class="e_Header__inner">
        <a class="e_Header__link" href="/">
          <img
            class="e_Header__logo"
            src="${IMAGE_SERVER2}/cdn/img/logo.svg"
            alt="Micro Frontends - Tractor Store"
          />
        </a>
        <div class="e_Header__navigation">${Navigation_default()}</div>
        <div class="e_Header__cart">${MiniCart_default({ c })}</div>
      </div>
    </div>
  </header>`;
};

// src/explore/components/Footer.js
var Footer_default = () => {
  return html2`<footer class="e_Footer" data-boundary="explore">
    <div class="e_Footer__cutter">
      <div class="e_Footer__inner">
        <div class="e_Footer__initiative">
          <!-- please leave this part untouched -->
          <img
            src="${IMAGE_SERVER2}/cdn/img/neulandlogo.svg"
            alt="neuland - Büro für Informatik"
            width="45"
            height="40"
          />
          <p>
            based on
            <a
              href="https://micro-frontends.org/tractor-store/"
              target="_blank"
            >
              the tractor store 2.0
            </a>
            <br />
            a
            <a href="https://neuland-bfi.de" target="_blank">neuland</a> project
          </p>
        </div>

        <div class="e_Footer__credits">
          <!-- replace this details about your implementation and organization -->
          <h3>techstack</h3>
          <p>
            ssr-only, modular monolith, template strings, esbuild, hono,
            cloudflare workers
          </p>
          <p>
            build by
            <img
              src="${IMAGE_SERVER2}/cdn/img/neulandlogo.svg"
              alt="neuland - Büro für Informatik"
              width="15"
              height="13"
            />
            <a href="https://neuland-bfi.de" target="_blank">neuland</a>
            /
            <a
              href="https://github.com/neuland/tractor-store-blueprint"
              target="_blank"
            >
              github
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>`;
};

// src/explore/components/Recommendation.js
var Recommendation_default = ({ image, url, name }) => {
  return html2`<li class="e_Recommendation">
    <a class="e_Recommendation_link" href="${url}">
      <img
        class="e_Recommendation_image"
        src="${src2(image, 200)}"
        srcet="${srcset2(image, [200, 400])}"
        alt=""
        sizes="200px"
        width="200"
        height="200"
      />
      <span class="e_Recommendation_name">${name}</span>
    </a>
  </li>`;
};

// src/explore/components/Recommendations.js
var r = database_default2.recommendations;
function averageColor(colors) {
  const total = colors.reduce(
    (acc, [r2, g, b]) => [acc[0] + r2, acc[1] + g, acc[2] + b],
    [0, 0, 0]
  );
  return total.map((c) => Math.round(c / colors.length));
}
function skusToColors(skus) {
  return skus.filter((sku) => r[sku]).map((sku) => r[sku].rgb);
}
function colorDistance(rgb1, rgb2) {
  const [r1, g1, b1] = rgb1;
  const [r2, g2, b2] = rgb2;
  return Math.sqrt(
    Math.pow(r1 - r2, 2) + Math.pow(g1 - g2, 2) + Math.pow(b1 - b2, 2)
  );
}
function recosForSkus(skus, length = 4) {
  const targetRgb = averageColor(skusToColors(skus));
  let distances = [];
  for (let sku in r) {
    if (!skus.includes(sku)) {
      const distance = colorDistance(targetRgb, r[sku].rgb);
      distances.push({ sku, distance });
    }
  }
  distances.sort((a, b) => a.distance - b.distance);
  return distances.slice(0, length).map((d) => r[d.sku]);
}
var Recommendations_default = ({ skus }) => {
  const recos = recosForSkus(skus);
  return recos.length ? html2`<div class="e_Recommendations" data-boundary="explore">
        <h2>Recommendations</h2>
        <ul class="e_Recommendations_list">
          ${recos.map(Recommendation_default).join("")}
        </ul>
      </div>` : "";
};

// src/explore/components/Meta.js
var Meta_default = () => {
  return html2`
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/cdn/img/meta/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/cdn/img/meta/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/cdn/img/meta/favicon-16x16.png"
    />
    <link rel="manifest" href="/cdn/img/meta/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/cdn/img/meta/safari-pinned-tab.svg"
      color="#ff5a55"
    />
    <link rel="shortcut icon" href="/cdn/img/meta/favicon.ico" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta
      name="msapplication-config"
      content="/cdn/img/meta/browserconfig.xml"
    />
    <meta name="theme-color" content="#ffffff" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `;
};

// src/explore/pages/HomePage.js
var _a;
var HomePage_default = ({ c }) => {
  return html2(_a || (_a = __template(['<!doctype html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <title>Tractor Store</title>\n        <meta\n          name="description"\n          content="a non-trivial micro frontends example project"\n        />\n        <link rel="stylesheet" href="/explore/static/styles.css" />\n        <link rel="stylesheet" href="/decide/static/styles.css" />\n        <link rel="stylesheet" href="/checkout/static/styles.css" />\n        ', '\n      </head>\n      <body data-boundary-page="explore">\n        ', '\n        <main class="e_HomePage">\n          ', '\n          <div class="e_HomePage__recommendations">\n            ', "\n          </div>\n        </main>\n        ", '\n        <script src="/explore/static/scripts.js" type="module"><\/script>\n        <script src="/decide/static/scripts.js" type="module"><\/script>\n        <script src="/checkout/static/scripts.js" type="module"><\/script>\n        <script src="/cdn/js/helper.js" type="module"><\/script>\n      </body>\n    </html>'])), Meta_default(), Header_default({ c }), database_default2.teaser.map(
    ({ title, image, url }) => html2`<a class="e_HomePage__categoryLink" href="${url}">
                  <img
                    src="${src2(image, 500)}"
                    srcet="${srcset2(image, [500, 1e3])}"
                    sizes="100vw, (min-width: 500px) 50vw"
                    alt=""
                  />
                  ${title}
                </a>`
  ).join(""), Recommendations_default({
    skus: ["CL-01-GY", "AU-07-MT"]
  }), Footer_default());
};

// src/explore/components/Store.js
var Store_default = ({ name, image, street, city }) => {
  return html2`<li class="e_Store">
    <div class="e_Store_content">
      <img
        class="e_Store_image"
        src="${src2(image, 200)}"
        srcset="${srcset2(image, [200, 400])}"
        width="200"
        height="200"
      />
      <p class="e_Store_address">
        ${name}<br />
        ${street}<br />
        ${city}
      </p>
    </div>
  </li>`;
};

// src/explore/pages/StoresPage.js
var _a2;
var StoresPage_default = ({ c }) => {
  return html2(_a2 || (_a2 = __template(['<!doctype html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <title>Tractor Store</title>\n        <meta\n          name="description"\n          content="a non-trivial micro frontends example project"\n        />\n        <link rel="stylesheet" href="/explore/static/styles.css" />\n        <link rel="stylesheet" href="/decide/static/styles.css" />\n        <link rel="stylesheet" href="/checkout/static/styles.css" />\n        ', '\n      </head>\n      <body data-boundary-page="explore">\n        ', '\n        <main class="e_StoresPage">\n          <h2>Our Stores</h2>\n          <p>\n            Want to see our products in person? Visit one of our stores to see\n            our products up close and talk to our experts. We have stores in the\n            following locations:\n          </p>\n          <ul class="e_StoresPage_list">\n            ', "\n          </ul>\n        </main>\n        ", '\n        <script src="/explore/static/scripts.js" type="module"><\/script>\n        <script src="/decide/static/scripts.js" type="module"><\/script>\n        <script src="/checkout/static/scripts.js" type="module"><\/script>\n        <script src="/cdn/js/helper.js" type="module"><\/script>\n      </body>\n    </html>'])), Meta_default(), Header_default({ c }), database_default2.stores.map(Store_default).join(""), Footer_default());
};

// src/explore/components/Product.js
var Product_default = ({ name, url, image, startPrice }) => {
  return html2`<li class="e_Product">
    <a class="e_Product_link" href="${url}">
      <img
        class="e_Product_image"
        src="${src2(image, 200)}"
        srcset="${srcset2(image, [200, 400, 800])}"
        sizes="300px"
        width="200"
        height="200"
      />
      <span class="e_Product_name">${name}</span>
      <span class="e_Product_price">${fmtprice(startPrice)}</span>
    </a>
  </li>`;
};

// src/explore/components/Filter.js
var Filter_default = ({ filters }) => {
  return html2`<div class="e_Filter">
    Filter:
    <ul>
      ${filters.map(
    (f) => f.active ? `<li class="e_Filter__filter--active">${f.name}</li>` : `<li><a href="${f.url}">${f.name}</a></li>`
  ).join("")}
    </ul>
  </div>`;
};

// src/explore/pages/CategoryPage.js
var _a3;
var CategoryPage_default = ({ category, c }) => {
  const cat = category && database_default2.categories.find((c2) => c2.key === category);
  const title = cat ? cat.name : "All Machines";
  const products = cat ? cat.products : database_default2.categories.flatMap((c2) => c2.products);
  products.sort((a, b) => b.startPrice - a.startPrice);
  const filters = [
    { url: "/products", name: "All", active: !cat },
    ...database_default2.categories.map((c2) => ({
      url: `/products/${c2.key}`,
      name: c2.name,
      active: c2.key === category
    }))
  ];
  return html2(_a3 || (_a3 = __template(['<!doctype html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <title>Tractor Store</title>\n        <meta\n          name="description"\n          content="a non-trivial micro frontends example project"\n        />\n        <link rel="stylesheet" href="/explore/static/styles.css" />\n        <link rel="stylesheet" href="/decide/static/styles.css" />\n        <link rel="stylesheet" href="/checkout/static/styles.css" />\n        ', '\n      </head>\n      <body data-boundary-page="explore">\n        ', '\n        <main class="e_CategoryPage">\n          <h2>', '</h2>\n          <div class="e_CategoryPage__subline">\n            <p>', " products</p>\n            ", '\n          </div>\n          <ul class="e_CategoryPage_list">\n            ', "\n          </ul>\n        </main>\n        ", '\n        <script src="/explore/static/scripts.js" type="module"><\/script>\n        <script src="/decide/static/scripts.js" type="module"><\/script>\n        <script src="/checkout/static/scripts.js" type="module"><\/script>\n        <script src="/cdn/js/helper.js" type="module"><\/script>\n      </body>\n    </html>'])), Meta_default(), Header_default({ c }), title, products.length, Filter_default({ filters }), products.map(Product_default).join(""), Footer_default());
};

// src/decide/utils.js
var html3 = String.raw;
var IMAGE_SERVER3 = typeof process === "undefined" || process.env.USE_LOCAL_IMAGES !== "true" ? "https://blueprint.the-tractor.store" : "";
function src3(image, size) {
  return IMAGE_SERVER3 + image.replace("[size]", `${size}`);
}
function srcset3(image, sizes = []) {
  return sizes.map((size) => `${src3(image, size)} ${size}w`).join(", ");
}

// src/decide/components/VariantOption.js
var VariantOption_default = ({ sku, name, selected, color }) => {
  return html3`<li class="d_VariantOption" style="--variant-color: ${color}">
    <i class="d_VariantOption__color"></i>
    ${selected ? html3`<strong>${name}</strong>` : html3`<a href="?sku=${sku}">${name}</a>`}
  </li>`;
};

// src/checkout/database/database.json
var database_default3 = {
  variants: [
    {
      id: "AU-01",
      name: "TerraFirma AutoCultivator T-300 Silver",
      sku: "AU-01-SI",
      price: 1e3,
      image: "/cdn/img/product/[size]/AU-01-SI.webp",
      inventory: 8
    },
    {
      id: "AU-02",
      name: "SmartFarm Titan Sunset Copper",
      sku: "AU-02-OG",
      price: 4100,
      image: "/cdn/img/product/[size]/AU-02-OG.webp",
      inventory: 4
    },
    {
      id: "AU-02",
      name: "SmartFarm Titan Cosmic Sapphire",
      sku: "AU-02-BL",
      price: 4e3,
      image: "/cdn/img/product/[size]/AU-02-BL.webp",
      inventory: 3
    },
    {
      id: "AU-02",
      name: "SmartFarm Titan Verdant Shadow",
      sku: "AU-02-GG",
      price: 4e3,
      image: "/cdn/img/product/[size]/AU-02-GG.webp",
      inventory: 6
    },
    {
      id: "AU-03",
      name: "FutureHarvest Navigator Turquoise Titan",
      sku: "AU-03-TQ",
      price: 1600,
      image: "/cdn/img/product/[size]/AU-03-TQ.webp",
      inventory: 9
    },
    {
      id: "AU-03",
      name: "FutureHarvest Navigator Majestic Violet",
      sku: "AU-03-PL",
      price: 1700,
      image: "/cdn/img/product/[size]/AU-03-PL.webp",
      inventory: 7
    },
    {
      id: "AU-03",
      name: "FutureHarvest Navigator Scarlet Dynamo",
      sku: "AU-03-RD",
      price: 1900,
      image: "/cdn/img/product/[size]/AU-03-RD.webp",
      inventory: 8
    },
    {
      id: "AU-03",
      name: "FutureHarvest Navigator Sunbeam Yellow",
      sku: "AU-03-YE",
      price: 1800,
      image: "/cdn/img/product/[size]/AU-03-YE.webp",
      inventory: 3
    },
    {
      id: "AU-04",
      name: "Sapphire Sunworker 460R Ruby Red",
      sku: "AU-04-RD",
      price: 8700,
      image: "/cdn/img/product/[size]/AU-04-RD.webp",
      inventory: 9
    },
    {
      id: "AU-04",
      name: "Sapphire Sunworker 460R Midnight Onyx",
      sku: "AU-04-BK",
      price: 8500,
      image: "/cdn/img/product/[size]/AU-04-BK.webp",
      inventory: 8
    },
    {
      id: "AU-05",
      name: "EcoGrow Crop Commander Zestful Horizon",
      sku: "AU-05-ZH",
      price: 3400,
      image: "/cdn/img/product/[size]/AU-05-ZH.webp",
      inventory: 8
    },
    {
      id: "AU-06",
      name: "FarmFleet Sovereign Canary Zenith",
      sku: "AU-06-CZ",
      price: 2200,
      image: "/cdn/img/product/[size]/AU-06-CZ.webp",
      inventory: 3
    },
    {
      id: "AU-06",
      name: "FarmFleet Sovereign Minted Jade",
      sku: "AU-06-MT",
      price: 2100,
      image: "/cdn/img/product/[size]/AU-06-MT.webp",
      inventory: 5
    },
    {
      id: "AU-07",
      name: "Verde Voyager Glacial Mint",
      sku: "AU-07-MT",
      price: 4e3,
      image: "/cdn/img/product/[size]/AU-07-MT.webp",
      inventory: 4
    },
    {
      id: "AU-07",
      name: "Verde Voyager Sunbeam Yellow",
      sku: "AU-07-YE",
      price: 5e3,
      image: "/cdn/img/product/[size]/AU-07-YE.webp",
      inventory: 9
    },
    {
      id: "AU-08",
      name: "Field Pioneer Polar White",
      sku: "AU-08-WH",
      price: 4500,
      image: "/cdn/img/product/[size]/AU-08-WH.webp",
      inventory: 4
    },
    {
      id: "CL-01",
      name: "Heritage Workhorse Verdant Field",
      sku: "CL-01-GR",
      price: 5700,
      image: "/cdn/img/product/[size]/CL-01-GR.webp",
      inventory: 8
    },
    {
      id: "CL-01",
      name: "Heritage Workhorse Stormy Sky",
      sku: "CL-01-GY",
      price: 6200,
      image: "/cdn/img/product/[size]/CL-01-GY.webp",
      inventory: 7
    },
    {
      id: "CL-02",
      name: "Falcon Crest Farm Cerulean Classic",
      sku: "CL-02-BL",
      price: 2600,
      image: "/cdn/img/product/[size]/CL-02-BL.webp",
      inventory: 1
    },
    {
      id: "CL-03",
      name: "Falcon Crest Work Meadow Green",
      sku: "CL-03-GR",
      price: 2300,
      image: "/cdn/img/product/[size]/CL-03-GR.webp",
      inventory: 7
    },
    {
      id: "CL-03",
      name: "Falcon Crest Work Rustic Rose",
      sku: "CL-03-PI",
      price: 2300,
      image: "/cdn/img/product/[size]/CL-03-PI.webp",
      inventory: 3
    },
    {
      id: "CL-03",
      name: "Falcon Crest Work Harvest Gold",
      sku: "CL-03-YE",
      price: 2300,
      image: "/cdn/img/product/[size]/CL-03-YE.webp",
      inventory: 6
    },
    {
      id: "CL-04",
      name: "Broadfield Majestic Oceanic Blue",
      sku: "CL-04-BL",
      price: 2200,
      image: "/cdn/img/product/[size]/CL-04-BL.webp",
      inventory: 6
    },
    {
      id: "CL-04",
      name: "Broadfield Majestic Rustic Crimson",
      sku: "CL-04-RD",
      price: 2200,
      image: "/cdn/img/product/[size]/CL-04-RD.webp",
      inventory: 3
    },
    {
      id: "CL-04",
      name: "Broadfield Majestic Aqua Green",
      sku: "CL-04-TQ",
      price: 2200,
      image: "/cdn/img/product/[size]/CL-04-TQ.webp",
      inventory: 0
    },
    {
      id: "CL-05",
      name: "Countryside Commander Pacific Teal",
      sku: "CL-05-PT",
      price: 2700,
      image: "/cdn/img/product/[size]/CL-05-PT.webp",
      inventory: 1
    },
    {
      id: "CL-05",
      name: "Countryside Commander Barn Red",
      sku: "CL-05-RD",
      price: 2700,
      image: "/cdn/img/product/[size]/CL-05-RD.webp",
      inventory: 1
    },
    {
      id: "CL-06",
      name: "Danamark Steadfast Emerald Forest",
      sku: "CL-06-MT",
      price: 2800,
      image: "/cdn/img/product/[size]/CL-06-MT.webp",
      inventory: 1
    },
    {
      id: "CL-06",
      name: "Danamark Steadfast Golden Wheat",
      sku: "CL-06-YE",
      price: 2800,
      image: "/cdn/img/product/[size]/CL-06-YE.webp",
      inventory: 2
    },
    {
      id: "CL-07",
      name: "Greenland Rover Forest Fern",
      sku: "CL-07-GR",
      price: 2900,
      image: "/cdn/img/product/[size]/CL-07-GR.webp",
      inventory: 4
    },
    {
      id: "CL-07",
      name: "Greenland Rover Autumn Amber",
      sku: "CL-07-YE",
      price: 2900,
      image: "/cdn/img/product/[size]/CL-07-YE.webp",
      inventory: 4
    },
    {
      id: "CL-08",
      name: "Holland Hamster Polder Green",
      sku: "CL-08-GR",
      price: 7750,
      image: "/cdn/img/product/[size]/CL-08-GR.webp",
      inventory: 8
    },
    {
      id: "CL-08",
      name: "Holland Hamster Tulip Magenta",
      sku: "CL-08-PI",
      price: 7900,
      image: "/cdn/img/product/[size]/CL-08-PI.webp",
      inventory: 3
    },
    {
      id: "CL-09",
      name: "TerraFirma Veneto Adriatic Blue",
      sku: "CL-09-BL",
      price: 2950,
      image: "/cdn/img/product/[size]/CL-09-BL.webp",
      inventory: 4
    },
    {
      id: "CL-09",
      name: "TerraFirma Veneto Tuscan Green",
      sku: "CL-09-GR",
      price: 2950,
      image: "/cdn/img/product/[size]/CL-09-GR.webp",
      inventory: 7
    },
    {
      id: "CL-10",
      name: "Global Gallant Sahara Dawn",
      sku: "CL-10-SD",
      price: 2600,
      image: "/cdn/img/product/[size]/CL-10-SD.webp",
      inventory: 6
    },
    {
      id: "CL-10",
      name: "Global Gallant Violet Vintage",
      sku: "CL-10-VI",
      price: 2600,
      image: "/cdn/img/product/[size]/CL-10-VI.webp",
      inventory: 2
    },
    {
      id: "CL-11",
      name: "Scandinavia Sower Baltic Blue",
      sku: "CL-11-SK",
      price: 3100,
      image: "/cdn/img/product/[size]/CL-11-SK.webp",
      inventory: 0
    },
    {
      id: "CL-11",
      name: "Scandinavia Sower Nordic Gold",
      sku: "CL-11-YE",
      price: 3100,
      image: "/cdn/img/product/[size]/CL-11-YE.webp",
      inventory: 3
    },
    {
      id: "CL-12",
      name: "Celerity Cruiser Velocity Blue",
      sku: "CL-12-BL",
      price: 3200,
      image: "/cdn/img/product/[size]/CL-12-BL.webp",
      inventory: 8
    },
    {
      id: "CL-12",
      name: "Celerity Cruiser Rally Red",
      sku: "CL-12-RD",
      price: 3200,
      image: "/cdn/img/product/[size]/CL-12-RD.webp",
      inventory: 8
    },
    {
      id: "CL-13",
      name: "Rapid Racer Speedway Blue",
      sku: "CL-13-BL",
      price: 7500,
      image: "/cdn/img/product/[size]/CL-13-BL.webp",
      inventory: 1
    },
    {
      id: "CL-13",
      name: "Rapid Racer Raceway Red",
      sku: "CL-13-RD",
      price: 7500,
      image: "/cdn/img/product/[size]/CL-13-RD.webp",
      inventory: 5
    },
    {
      id: "CL-14",
      name: "Caribbean Cruiser Emerald Grove",
      sku: "CL-14-GR",
      price: 2300,
      image: "/cdn/img/product/[size]/CL-14-GR.webp",
      inventory: 3
    },
    {
      id: "CL-14",
      name: "Caribbean Cruiser Ruby Fields",
      sku: "CL-14-RD",
      price: 2300,
      image: "/cdn/img/product/[size]/CL-14-RD.webp",
      inventory: 5
    },
    {
      id: "CL-15",
      name: "Fieldmaster Classic Vintage Pink",
      sku: "CL-15-PI",
      price: 6200,
      image: "/cdn/img/product/[size]/CL-15-PI.webp",
      inventory: 0
    },
    {
      id: "CL-15",
      name: "Fieldmaster Classic Sahara Dust",
      sku: "CL-15-SD",
      price: 6200,
      image: "/cdn/img/product/[size]/CL-15-SD.webp",
      inventory: 9
    }
  ]
};

// src/checkout/database/index.js
var database_default4 = database_default3;

// src/checkout/components/AddToCart.js
var AddToCart_default = ({ sku }) => {
  const variant = database_default4.variants.find((p) => p.sku === sku);
  const outOfStock = variant.inventory === 0;
  return html`<form
    action="/checkout/cart/add"
    method="POST"
    class="c_AddToCart"
    data-boundary="checkout"
  >
    <input type="hidden" name="sku" value="${sku}" />
    <div class="c_AddToCart__information">
      <p>${variant.price} Ø</p>
      ${variant.inventory > 0 ? html`<p class="c_AddToCart__stock c_AddToCart__stock--ok">
            ${variant.inventory} in stock, free shipping
          </p>` : html`<p class="c_AddToCart__stock c_AddToCart__stock--empty">
            out of stock
          </p>`}
    </div>
    ${Button_default({
    disabled: outOfStock,
    className: "c_AddToCart__button",
    children: html`add to basket`,
    variant: "primary"
  })}
    <div class="c_AddToCart__confirmed c_AddToCart__confirmed--hidden">
      <p>Tractor was added.</p>
      <a href="/checkout/cart" class="c_AddToCart__link">View in basket.</a>
    </div>
  </form>`;
};

// src/decide/database/database.json
var database_default5 = {
  products: [
    {
      name: "TerraFirma AutoCultivator T-300",
      id: "AU-01",
      category: "autonomous",
      highlightsa: [
        "Precision GPS mapping optimizes field coverage.",
        "Hybrid engine ensures eco-friendly extended operation.",
        "Fully autonomous with smart obstacle detection and terrain adaptation."
      ],
      variants: [
        {
          name: "Silver",
          image: "/cdn/img/product/[size]/AU-01-SI.webp",
          sku: "AU-01-SI",
          color: "#C0C0C0",
          price: 1e3
        }
      ]
    },
    {
      name: "SmartFarm Titan",
      id: "AU-02",
      category: "autonomous",
      highlights: [
        "Advanced autopilot technology for precise farming operations.",
        "Eco-friendly solar-assisted power system for sustainable use.",
        "Intelligent AI for real-time field analysis and automated adjustments."
      ],
      variants: [
        {
          name: "Sunset Copper",
          image: "/cdn/img/product/[size]/AU-02-OG.webp",
          sku: "AU-02-OG",
          color: "#dd5219",
          price: 4100
        },
        {
          name: "Cosmic Sapphire",
          image: "/cdn/img/product/[size]/AU-02-BL.webp",
          sku: "AU-02-BL",
          color: "#2A52BE",
          price: 4e3
        },
        {
          name: "Verdant Shadow",
          image: "/cdn/img/product/[size]/AU-02-GG.webp",
          sku: "AU-02-GG",
          color: "#005A04",
          price: 4e3
        }
      ]
    },
    {
      name: "FutureHarvest Navigator",
      id: "AU-03",
      category: "autonomous",
      highlights: [
        "Autonomous navigation with sub-inch accuracy",
        "Solar-enhanced hybrid powertrain for extended operation",
        "Real-time crop and soil health analytics"
      ],
      variants: [
        {
          name: "Turquoise Titan",
          image: "/cdn/img/product/[size]/AU-03-TQ.webp",
          sku: "AU-03-TQ",
          color: "#169fb8",
          price: 1600
        },
        {
          name: "Majestic Violet",
          image: "/cdn/img/product/[size]/AU-03-PL.webp",
          sku: "AU-03-PL",
          color: "#9B5FC0",
          price: 1700
        },
        {
          name: "Scarlet Dynamo",
          image: "/cdn/img/product/[size]/AU-03-RD.webp",
          sku: "AU-03-RD",
          color: "#FF2400",
          price: 1900
        },
        {
          name: "Sunbeam Yellow",
          image: "/cdn/img/product/[size]/AU-03-YE.webp",
          sku: "AU-03-YE",
          color: "#faad00",
          price: 1800
        }
      ]
    },
    {
      name: "Sapphire Sunworker 460R",
      id: "AU-04",
      category: "autonomous",
      highlights: [
        "Next-generation autonomous guidance system for seamless operation",
        "High-capacity energy storage for all-day work without recharge",
        "Advanced analytics suite for precision soil and plant health management"
      ],
      variants: [
        {
          name: "Ruby Red",
          image: "/cdn/img/product/[size]/AU-04-RD.webp",
          sku: "AU-04-RD",
          color: "#9B111E",
          price: 8700
        },
        {
          name: "Midnight Onyx",
          image: "/cdn/img/product/[size]/AU-04-BK.webp",
          sku: "AU-04-BK",
          color: "#353839",
          price: 8500
        }
      ]
    },
    {
      name: "EcoGrow Crop Commander",
      id: "AU-05",
      category: "autonomous",
      highlights: [
        "Ultra-precise field navigation technology",
        "Dual-mode power system for maximum uptime",
        "On-the-go field data analysis for smart farming decisions"
      ],
      variants: [
        {
          name: "Zestful Horizon",
          image: "/cdn/img/product/[size]/AU-05-ZH.webp",
          sku: "AU-05-ZH",
          color: "#FFA07A",
          price: 3400
        }
      ]
    },
    {
      name: "FarmFleet Sovereign",
      id: "AU-06",
      category: "autonomous",
      highlights: [
        "Robust all-terrain adaptability for diverse farm landscapes",
        "High-efficiency energy matrix for longer field endurance",
        "Integrated crop management system with advanced diagnostics"
      ],
      variants: [
        {
          name: "Canary Zenith",
          image: "/cdn/img/product/[size]/AU-06-CZ.webp",
          sku: "AU-06-CZ",
          color: "#FFD700",
          price: 2200
        },
        {
          name: "Minted Jade",
          color: "#628882",
          image: "/cdn/img/product/[size]/AU-06-MT.webp",
          sku: "AU-06-MT",
          price: 2100
        }
      ]
    },
    {
      name: "Verde Voyager",
      id: "AU-07",
      category: "autonomous",
      highlights: [
        "Adaptive drive system intelligently navigates through diverse field conditions",
        "Clean energy operation with advanced solar battery technology",
        "High-resolution field scanners for precise agronomy insights"
      ],
      variants: [
        {
          name: "Glacial Mint",
          image: "/cdn/img/product/[size]/AU-07-MT.webp",
          sku: "AU-07-MT",
          color: "#AFDBD2",
          price: 4e3
        },
        {
          name: "Sunbeam Yellow",
          image: "/cdn/img/product/[size]/AU-07-YE.webp",
          sku: "AU-07-YE",
          color: "#FFDA03",
          price: 5e3
        }
      ]
    },
    {
      name: "Field Pioneer",
      id: "AU-08",
      category: "autonomous",
      highlights: [
        "Automated field traversal with intelligent pathfinding algorithms",
        "Eco-friendly electric motors paired with high-capacity batteries",
        "Real-time environmental monitoring for optimal crop growth"
      ],
      variants: [
        {
          name: "Polar White",
          image: "/cdn/img/product/[size]/AU-08-WH.webp",
          sku: "AU-08-WH",
          color: "#E8E8E8",
          price: 4500
        }
      ]
    },
    {
      name: "Heritage Workhorse",
      id: "CL-01",
      category: "classic",
      highlights: [
        "Proven reliability with a touch of modern reliability enhancements",
        "Robust construction equipped to withstand decades of labor",
        "User-friendly operation with traditional manual controls"
      ],
      variants: [
        {
          name: "Verdant Field",
          image: "/cdn/img/product/[size]/CL-01-GR.webp",
          sku: "CL-01-GR",
          color: "#6B8E23",
          price: 5700
        },
        {
          name: "Stormy Sky",
          image: "/cdn/img/product/[size]/CL-01-GY.webp",
          sku: "CL-01-GY",
          color: "#708090",
          price: 6200
        }
      ]
    },
    {
      name: "Falcon Crest Farm",
      id: "CL-02",
      category: "classic",
      highlights: [
        "Rugged simplicity meets classic design",
        "Built-to-last machinery for reliable fieldwork",
        "Ease of control with straightforward mechanical systems"
      ],
      variants: [
        {
          name: "Cerulean Classic",
          image: "/cdn/img/product/[size]/CL-02-BL.webp",
          sku: "CL-02-BL",
          color: "#007BA7",
          price: 2600
        }
      ]
    },
    {
      name: "Falcon Crest Work",
      id: "CL-03",
      category: "classic",
      highlights: [
        "Vintage engineering with a legacy of durability",
        "Powerful yet simple mechanics for easy operation and repair",
        "Classic aesthetics with a robust body, built to last"
      ],
      variants: [
        {
          name: "Meadow Green",
          image: "/cdn/img/product/[size]/CL-03-GR.webp",
          sku: "CL-03-GR",
          color: "#7CFC00",
          price: 2300
        },
        {
          name: "Rustic Rose",
          image: "/cdn/img/product/[size]/CL-03-PI.webp",
          sku: "CL-03-PI",
          color: "#b50018",
          price: 2300
        },
        {
          name: "Harvest Gold",
          image: "/cdn/img/product/[size]/CL-03-YE.webp",
          sku: "CL-03-YE",
          color: "#DA9100",
          price: 2300
        }
      ]
    },
    {
      name: "Broadfield Majestic",
      id: "CL-04",
      category: "classic",
      highlights: [
        "Built with the robust heart of early industrial workhorses",
        "Simplified mechanics for unparalleled ease of use and maintenance",
        "A testament to early agricultural machinery with a dependable engine"
      ],
      variants: [
        {
          name: "Oceanic Blue",
          image: "/cdn/img/product/[size]/CL-04-BL.webp",
          sku: "CL-04-BL",
          color: "#0040a6",
          price: 2200
        },
        {
          name: "Rustic Crimson",
          image: "/cdn/img/product/[size]/CL-04-RD.webp",
          sku: "CL-04-RD",
          color: "#7B3F00",
          price: 2200
        },
        {
          name: "Aqua Green",
          image: "/cdn/img/product/[size]/CL-04-TQ.webp",
          sku: "CL-04-TQ",
          color: "#00b298",
          price: 2200
        }
      ]
    },
    {
      name: "Countryside Commander",
      id: "CL-05",
      category: "classic",
      highlights: [
        "Reliable performance with time-tested engineering",
        "Rugged design for efficient operation across all types of terrain",
        "Classic operator comfort with modern ergonomic enhancements"
      ],
      variants: [
        {
          name: "Pacific Teal",
          image: "/cdn/img/product/[size]/CL-05-PT.webp",
          sku: "CL-05-PT",
          color: "#479da8",
          price: 2700
        },
        {
          name: "Barn Red",
          image: "/cdn/img/product/[size]/CL-05-RD.webp",
          sku: "CL-05-RD",
          color: "#7C0A02",
          price: 2700
        }
      ]
    },
    {
      name: "Danamark Steadfast",
      id: "CL-06",
      category: "classic",
      highlights: [
        "Engineered for the meticulous demands of Danish agriculture",
        "Sturdy chassis and reliable mechanics for longevity",
        "Utilitarian design with practical functionality and comfort"
      ],
      variants: [
        {
          name: "Emerald Forest",
          image: "/cdn/img/product/[size]/CL-06-MT.webp",
          sku: "CL-06-MT",
          color: "#46f5bb",
          price: 2800
        },
        {
          name: "Golden Wheat",
          image: "/cdn/img/product/[size]/CL-06-YE.webp",
          sku: "CL-06-YE",
          color: "#faaf3f",
          price: 2800
        }
      ]
    },
    {
      name: "Greenland Rover",
      id: "CL-07",
      category: "classic",
      highlights: [
        "Engineered to tackle the diverse European terrain with ease",
        "Sturdy and reliable mechanics known for their longevity",
        "Ergonomically designed for comfort during long working hours"
      ],
      variants: [
        {
          name: "Forest Fern",
          image: "/cdn/img/product/[size]/CL-07-GR.webp",
          sku: "CL-07-GR",
          color: "#2ea250",
          price: 2900
        },
        {
          name: "Autumn Amber",
          image: "/cdn/img/product/[size]/CL-07-YE.webp",
          sku: "CL-07-YE",
          color: "#FFBF00",
          price: 2900
        }
      ]
    },
    {
      name: "Holland Hamster",
      id: "CL-08",
      category: "classic",
      highlights: [
        "Dutch craftsmanship for precision and quality",
        "Optimized for tulip fields and versatile European landscapes",
        "Ergonomic design with a focus on operator comfort and efficiency"
      ],
      variants: [
        {
          name: "Polder Green",
          image: "/cdn/img/product/[size]/CL-08-GR.webp",
          sku: "CL-08-GR",
          color: "#C2B280",
          price: 7750
        },
        {
          name: "Tulip Magenta",
          image: "/cdn/img/product/[size]/CL-08-PI.webp",
          sku: "CL-08-PI",
          color: "#D65282",
          price: 7900
        }
      ]
    },
    {
      name: "TerraFirma Veneto",
      id: "CL-09",
      category: "classic",
      highlights: [
        "Elegant Italian design with sleek lines and a vibrant aesthetic",
        "Precision mechanics for vineyard and orchard maneuverability",
        "Comfort-focused design with a flair for the dramatic"
      ],
      variants: [
        {
          name: "Adriatic Blue",
          image: "/cdn/img/product/[size]/CL-09-BL.webp",
          sku: "CL-09-BL",
          color: "#2f6ea3",
          price: 2950
        },
        {
          name: "Tuscan Green",
          image: "/cdn/img/product/[size]/CL-09-GR.webp",
          sku: "CL-09-GR",
          color: "#518b2b",
          price: 2950
        }
      ]
    },
    {
      name: "Global Gallant",
      id: "CL-10",
      category: "classic",
      highlights: [
        "Retro design with a nod to the golden era of farming",
        "Engine robustness that stands the test of time",
        "Functional simplicity for ease of operation in any region"
      ],
      variants: [
        {
          name: "Sahara Dawn",
          image: "/cdn/img/product/[size]/CL-10-SD.webp",
          sku: "CL-10-SD",
          color: "#b8a875",
          price: 2600
        },
        {
          name: "Violet Vintage",
          image: "/cdn/img/product/[size]/CL-10-VI.webp",
          sku: "CL-10-VI",
          color: "#8A2BE2",
          price: 2600
        }
      ]
    },
    {
      name: "Scandinavia Sower",
      id: "CL-11",
      category: "classic",
      highlights: [
        "Authentic Swedish engineering for optimal cold-climate performance",
        "Sturdy build and mechanics for lifelong reliability",
        "Iconic design reflecting the simplicity and efficiency of Scandinavian style"
      ],
      variants: [
        {
          name: "Baltic Blue",
          image: "/cdn/img/product/[size]/CL-11-SK.webp",
          sku: "CL-11-SK",
          color: "#95c1f4",
          price: 3100
        },
        {
          name: "Nordic Gold",
          image: "/cdn/img/product/[size]/CL-11-YE.webp",
          sku: "CL-11-YE",
          color: "#FFD700",
          price: 3100
        }
      ]
    },
    {
      name: "Celerity Cruiser",
      id: "CL-12",
      category: "classic",
      highlights: [
        "A speedster in the classic tractor segment, unparalleled in quick task completion",
        "Sleek design with aerodynamic contours for reduced drag",
        "Enhanced gearbox for smooth acceleration and nimble handling"
      ],
      variants: [
        {
          name: "Velocity Blue",
          image: "/cdn/img/product/[size]/CL-12-BL.webp",
          sku: "CL-12-BL",
          color: "#1E90FF",
          price: 3200
        },
        {
          name: "Rally Red",
          image: "/cdn/img/product/[size]/CL-12-RD.webp",
          sku: "CL-12-RD",
          color: "#ED2939",
          price: 3200
        }
      ]
    },
    {
      name: "Rapid Racer",
      id: "CL-13",
      category: "classic",
      highlights: [
        "Streamlined design for faster field operations",
        "Optimized gear ratios for efficient power transmission",
        "Advanced air flow system for superior engine cooling"
      ],
      variants: [
        {
          name: "Speedway Blue",
          image: "/cdn/img/product/[size]/CL-13-BL.webp",
          sku: "CL-13-BL",
          color: "#2679a6",
          price: 7500
        },
        {
          name: "Raceway Red",
          image: "/cdn/img/product/[size]/CL-13-RD.webp",
          sku: "CL-13-RD",
          color: "#CF1020",
          price: 7500
        }
      ]
    },
    {
      name: "Caribbean Cruiser",
      id: "CL-14",
      category: "classic",
      highlights: [
        "Robust construction for enduring performance",
        "Time-tested design with a proven track record",
        "Easy-to-service mechanics for long-term reliability"
      ],
      variants: [
        {
          name: "Emerald Grove",
          image: "/cdn/img/product/[size]/CL-14-GR.webp",
          sku: "CL-14-GR",
          color: "#57ae13",
          price: 2300
        },
        {
          name: "Ruby Fields",
          image: "/cdn/img/product/[size]/CL-14-RD.webp",
          sku: "CL-14-RD",
          color: "#cd2b1e",
          price: 2300
        }
      ]
    },
    {
      name: "Fieldmaster Classic",
      id: "CL-15",
      category: "classic",
      highlights: [
        "Timeless design with a focus on comfort and control",
        "Efficient fuel consumption with a powerful engine",
        "Versatile functionality for all types of agricultural work"
      ],
      variants: [
        {
          name: "Vintage Pink",
          image: "/cdn/img/product/[size]/CL-15-PI.webp",
          sku: "CL-15-PI",
          color: "#e1949e",
          price: 6200
        },
        {
          name: "Sahara Dust",
          image: "/cdn/img/product/[size]/CL-15-SD.webp",
          sku: "CL-15-SD",
          color: "#dec78c",
          price: 6200
        }
      ]
    }
  ]
};

// src/decide/database/index.js
var database_default6 = database_default5;

// src/decide/components/Meta.js
var Meta_default2 = () => {
  return html3`
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/cdn/img/meta/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/cdn/img/meta/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/cdn/img/meta/favicon-16x16.png"
    />
    <link rel="manifest" href="/cdn/img/meta/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/cdn/img/meta/safari-pinned-tab.svg"
      color="#ff5a55"
    />
    <link rel="shortcut icon" href="/cdn/img/meta/favicon.ico" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta
      name="msapplication-config"
      content="/cdn/img/meta/browserconfig.xml"
    />
    <meta name="theme-color" content="#ffffff" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `;
};

// src/decide/pages/ProductPage.js
var _a4;
var ProductPage_default = ({ id, sku, c }) => {
  const {
    name,
    variants,
    highlights = []
  } = database_default6.products.find((p) => p.id === id);
  const variant = variants.find((v) => v.sku === sku) || variants[0];
  return html3(_a4 || (_a4 = __template(['<!doctype html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <title>Tractor Store</title>\n        <meta\n          name="description"\n          content="a non-trivial micro frontends example project"\n        />\n        <link rel="stylesheet" href="/explore/static/styles.css" />\n        <link rel="stylesheet" href="/decide/static/styles.css" />\n        <link rel="stylesheet" href="/checkout/static/styles.css" />\n        ', '\n      </head>\n      <body data-boundary-page="decide">\n        ', '\n        <main class="d_ProductPage">\n          <div class="d_ProductPage__details">\n            <img\n              class="d_ProductPage__productImage"\n              src="', '"\n              srcset="', '"\n              sizes="400px"\n              width="400"\n              height="400"\n              alt="', " - ", '"\n            />\n            <div class="d_ProductPage__productInformation">\n              <h2 class="d_ProductPage__title">', '</h2>\n              <ul class="d_ProductPage__highlights">\n                ', '\n              </ul>\n              <ul class="d_ProductPage__variants">\n                ', "\n              </ul>\n              ", "\n            </div>\n          </div>\n          ", "\n        </main>\n        ", '\n        <script src="/explore/static/scripts.js" type="module"><\/script>\n        <script src="/decide/static/scripts.js" type="module"><\/script>\n        <script src="/checkout/static/scripts.js" type="module"><\/script>\n        <script src="/cdn/js/helper.js" type="module"><\/script>\n      </body>\n    </html>'])), Meta_default2(), Header_default({ c }), src3(variant.image, 400), srcset3(variant.image, [400, 800]), name, variant.name, name, highlights.map((highlight) => html3`<li>${highlight}</li>`).join(""), variants.map(
    (v) => VariantOption_default({ ...v, selected: v.sku === variant.sku })
  ).join(""), AddToCart_default({ sku: variant.sku }), Recommendations_default({ skus: [variant.sku] }), Footer_default());
};

// src/checkout/components/Meta.js
var Meta_default3 = () => {
  return html`
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/cdn/img/meta/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="/cdn/img/meta/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="/cdn/img/meta/favicon-16x16.png"
    />
    <link rel="manifest" href="/cdn/img/meta/site.webmanifest" />
    <link
      rel="mask-icon"
      href="/cdn/img/meta/safari-pinned-tab.svg"
      color="#ff5a55"
    />
    <link rel="shortcut icon" href="/cdn/img/meta/favicon.ico" />
    <meta name="msapplication-TileColor" content="#ffffff" />
    <meta
      name="msapplication-config"
      content="/cdn/img/meta/browserconfig.xml"
    />
    <meta name="theme-color" content="#ffffff" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  `;
};

// src/checkout/components/Page.js
var _a5;
var Page_default = ({ content }) => {
  return html(_a5 || (_a5 = __template(['<!doctype html>\n    <html lang="en">\n      <head>\n        <meta charset="utf-8" />\n        <title>Tractor Store</title>\n        <meta\n          name="description"\n          content="a non-trivial micro frontends example project"\n        />\n        <link rel="stylesheet" href="/explore/static/styles.css" />\n        <link rel="stylesheet" href="/decide/static/styles.css" />\n        <link rel="stylesheet" href="/checkout/static/styles.css" />\n        ', '\n      </head>\n      <body data-boundary-page="checkout">\n        ', '\n        <script src="/explore/static/scripts.js" type="module"><\/script>\n        <script src="/decide/static/scripts.js" type="module"><\/script>\n        <script src="/checkout/static/scripts.js" type="module"><\/script>\n        <script src="/cdn/js/helper.js" type="module"><\/script>\n      </body>\n    </html>'])), Meta_default3(), content);
};

// src/checkout/components/LineItem.js
var LineItem_default = ({ sku, id, name, quantity, total, image }) => {
  const url = `/product/${id}?sku=${sku}`;
  return html`<li class="c_LineItem">
    <a href="${url}" class="c_LineItem__image">
      <img
        src="${src(image, 200)}"
        srcset="${srcset(image, [200, 400])}"
        sizes="200px"
        alt="${name}"
        width="200"
        height="200"
      />
    </a>
    <div class="c_LineItem__details">
      <a href="${url}" class="c_LineItem__name">
        <strong>${name}</strong><br />${sku}
      </a>

      <div class="c_LineItem__quantity">
        <span>${quantity}</span>

        <form action="/checkout/cart/remove" method="post">
          <input type="hidden" name="sku" value="${sku}" />
          ${Button_default({
    variant: "secondary",
    rounded: true,
    type: "submit",
    value: "remove",
    size: "small",
    title: `Remove ${name} from cart`,
    children: html`<svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              height="20"
              width="20"
              viewBox="0 0 48 48"
            >
              <path
                fill="#000"
                d="m40 5.172-16 16-16-16L5.171 8l16.001 16L5.171 40 8 42.828l16-16 16 16L42.828 40l-16-16 16-16L40 5.172Z"
              />
            </svg>`
  })}
        </form>
      </div>
      <div class="c_LineItem__price">${total} Ø</div>
    </div>
  </li>`;
};

// src/checkout/pages/CartPage.js
function convertToLineItems(items) {
  return items.reduce((res, { sku, quantity }) => {
    const variant = database_default4.variants.find((p) => p.sku === sku);
    if (variant) {
      res.push({ ...variant, quantity, total: variant.price * quantity });
    }
    return res;
  }, []);
}
var CartPage_default = ({ c }) => {
  const cookieLineItems = readFromCookie(c);
  const lineItems = convertToLineItems(cookieLineItems);
  const total = lineItems.reduce((res, { total: total2 }) => res + total2, 0);
  const skus = lineItems.map(({ sku }) => sku);
  const content = html`
    ${Header_default({ c })}
    <main class="c_CartPage">
      <h2>Basket</h2>
      <ul class="c_CartPage__lineItems">
        ${lineItems.map(LineItem_default).join("")}
      </ul>
      <hr />
      <p class="c_CartPage__total">Total: ${total} Ø</p>

      <div class="c_CartPage__buttons">
        ${Button_default({
    href: "/checkout/checkout",
    children: "Checkout",
    variant: "primary"
  })}
        ${Button_default({
    href: "/",
    children: "Continue Shopping",
    variant: "secondary"
  })}
      </div>

      ${Recommendations_default({ skus })}
    </main>
    ${Footer_default()}
  `;
  return Page_default({ content });
};

// src/checkout/components/CompactHeader.js
var CompactHeader_default = () => {
  return html`<header class="c_CompactHeader">
    <div class="c_CompactHeader__inner">
      <a class="c_CompactHeader__link" href="/">
        <img
          class="c_CompactHeader__logo"
          src="${IMAGE_SERVER}/cdn/img/logo.svg"
          alt="Micro Frontends - Tractor Store"
        />
      </a>
    </div>
  </header>`;
};

// src/explore/components/Button.js
var Button_default2 = ({
  href,
  type,
  value,
  disabled,
  rounded,
  className,
  children,
  dataId,
  variant = "secondary"
}) => {
  const tag = href ? "a" : "button";
  return html2` <${tag}
    ${disabled ? "disabled" : ""}
    ${href ? `href="${href}"` : ""}
    ${type ? `type="${type}"` : ""}
    ${value ? `value="${value}"` : ""}
    ${dataId ? `data-id="${dataId}"` : ""}
    class="e_Button e_Button--${variant} ${className} ${rounded ? "e_Button--rounded" : ""}"
  >
    <div class="e_Button__inner">${children}</div>
  </${tag}>`;
};

// src/explore/components/StorePicker.js
var StorePicker_default = () => {
  return html2`<div class="e_StorePicker">
    <div class="e_StorePicker_control" data-boundary="explore">
      <div class="e_StorePicker_selected"></div>
      ${Button_default2({
    className: "e_StorePicker_choose",
    type: "button",
    children: "choose a store"
  })}
    </div>
    <dialog class="e_StorePicker_dialog" data-boundary="explore">
      <div class="e_StorePicker_wrapper">
        <h2>Stores</h2>
        <ul class="e_StorePicker_list">
          ${database_default2.stores.map(
    (s) => html2`<li class="e_StorePicker_entry">
                  <div class="e_StorePicker_content">
                    <img
                      class="e_StorePicker_image"
                      src="${src2(s.image, 200)}"
                      srcset="${srcset2(s.image, [200, 400])}"
                      width="200"
                      height="200"
                    />
                    <p class="e_StorePicker_address">
                      ${s.name}<br />
                      ${s.street}<br />
                      ${s.city}
                    </p>
                  </div>
                  ${Button_default2({
      className: "e_StorePicker_select",
      type: "button",
      children: "select",
      dataId: s.id
    })}
                </li>`
  ).join("")}
        </ul>
      </div>
    </dialog>
  </div>`;
};

// src/checkout/pages/Checkout.js
var Checkout_default = () => {
  const content = html`
    ${CompactHeader_default()}
    <main class="c_Checkout">
      <h2>Checkout</h2>
      <form
        action="/checkout/place-order"
        method="post"
        class="c_Checkout__form"
      >
        <h3>Personal Data</h3>
        <fieldset class="c_Checkout__name">
          <div>
            <label class="c_Checkout__label" for="c_firstname">
              First name
            </label>
            <input
              class="c_Checkout__input"
              type="text"
              id="c_firstname"
              name="firstname"
              required
            />
          </div>
          <div>
            <label class="c_Checkout__label" for="c_lastname">Last name</label>
            <input
              class="c_Checkout__input"
              type="text"
              id="c_lastname"
              name="lastname"
              required
            />
          </div>
        </fieldset>

        <h3>Store Pickup</h3>
        <fieldset>
          <div class="c_Checkout__store">${StorePicker_default()}</div>
          <label class="c_Checkout__label" for="c_storeId">Store ID</label>
          <input
            class="c_Checkout__input"
            type="text"
            id="c_storeId"
            name="storeId"
            readonly
            required
          />
        </fieldset>

        <div class="c_Checkout__buttons">
          ${Button_default({
    children: "place order",
    type: "submit",
    variant: "primary",
    disabled: true
  })}
          ${Button_default({
    href: "/checkout/cart",
    children: "back to cart",
    variant: "secondary"
  })}
        </div>
      </form>
    </main>
    ${Footer_default()}
  `;
  return Page_default({ content });
};

// src/checkout/pages/Thanks.js
var Thanks_default = ({ c }) => {
  const content = html`
    ${Header_default({ c })}
    <main class="c_Thanks">
      <h2 class="c_Thanks__title">Thanks for your order!</h2>
      <p class="c_Thanks__text">We'll notify you, when its ready for pickup.</p>

      ${Button_default({
    href: "/",
    children: "Continue Shopping",
    variant: "secondary"
  })}
    </main>
    ${Footer_default()}
  `;
  return Page_default({ content });
};

// src/checkout/actions.js
async function handleAddToCart(c) {
  const body = await c.req.parseBody();
  const sku = body.sku;
  const items = readFromCookie(c);
  const lineItem = items.find((i) => i.sku === sku);
  if (lineItem) {
    lineItem.quantity++;
  } else {
    items.push({ sku, quantity: 1 });
  }
  writeToCookie(items, c);
}
async function handleRemoveFromCart(c) {
  const body = await c.req.parseBody();
  const sku = body.sku;
  const items = readFromCookie(c);
  const lineItem = items.find((i) => i.sku === sku);
  if (lineItem) {
    const index = items.indexOf(lineItem);
    items.splice(index, 1);
  }
  writeToCookie(items, c);
}
async function handlePlaceOrder(c) {
  writeToCookie([], c);
}

// src/server.js
function createServer() {
  const app2 = new Hono2();
  app2.use(logger());
  app2.get("/", async (c) => {
    return c.html(HomePage_default({ c }));
  });
  app2.get("/stores", async (c) => {
    return c.html(StoresPage_default({ c }));
  });
  app2.get("/products/:category?", async (c) => {
    console.log("category", c.req.param("category"));
    const category = c.req.param("category");
    return c.html(CategoryPage_default({ category, c }));
  });
  app2.get("/product/:id", async (c) => {
    const { id } = c.req.param();
    const sku = c.req.query("sku");
    return c.html(ProductPage_default({ id, sku, c }));
  });
  app2.get("/checkout/cart", (c) => c.html(CartPage_default({ c })));
  app2.get("/checkout/checkout", (c) => c.html(Checkout_default()));
  app2.get("/checkout/mini-cart", (c) => c.html(MiniCart_default({ c })));
  app2.post("/checkout/cart/add", async (c) => {
    await handleAddToCart(c);
    return c.redirect("/checkout/cart");
  });
  app2.post("/checkout/cart/remove", async (c) => {
    await handleRemoveFromCart(c);
    return c.redirect("/checkout/cart");
  });
  app2.post("/checkout/place-order", async (c) => {
    await handlePlaceOrder(c);
    return c.redirect("/checkout/thanks");
  });
  app2.get("/checkout/thanks", (c) => c.html(Thanks_default({ c })));
  return app2;
}

// node_modules/hono/dist/utils/filepath.js
var getFilePath = (options) => {
  let filename = options.filename;
  const defaultDocument = options.defaultDocument || "index.html";
  if (filename.endsWith("/")) {
    filename = filename.concat(defaultDocument);
  } else if (!filename.match(/\.[a-zA-Z0-9]+$/)) {
    filename = filename.concat("/" + defaultDocument);
  }
  const path = getFilePathWithoutDefaultDocument({
    root: options.root,
    filename
  });
  return path;
};
var getFilePathWithoutDefaultDocument = (options) => {
  let root = options.root || "";
  let filename = options.filename;
  if (/(?:^|[\/\\])\.\.(?:$|[\/\\])/.test(filename)) {
    return;
  }
  filename = filename.replace(/^\.?[\/\\]/, "");
  filename = filename.replace(/\\/, "/");
  root = root.replace(/\/$/, "");
  let path = root ? root + "/" + filename : filename;
  path = path.replace(/^\.?\//, "");
  return path;
};

// node_modules/hono/dist/utils/mime.js
var getMimeType = (filename, mimes = baseMimes) => {
  const regexp = /\.([a-zA-Z0-9]+?)$/;
  const match = filename.match(regexp);
  if (!match) {
    return;
  }
  let mimeType = mimes[match[1]];
  if (mimeType && mimeType.startsWith("text") || mimeType === "application/json") {
    mimeType += "; charset=utf-8";
  }
  return mimeType;
};
var baseMimes = {
  aac: "audio/aac",
  avi: "video/x-msvideo",
  avif: "image/avif",
  av1: "video/av1",
  bin: "application/octet-stream",
  bmp: "image/bmp",
  css: "text/css",
  csv: "text/csv",
  eot: "application/vnd.ms-fontobject",
  epub: "application/epub+zip",
  gif: "image/gif",
  gz: "application/gzip",
  htm: "text/html",
  html: "text/html",
  ico: "image/x-icon",
  ics: "text/calendar",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  js: "text/javascript",
  json: "application/json",
  jsonld: "application/ld+json",
  map: "application/json",
  mid: "audio/x-midi",
  midi: "audio/x-midi",
  mjs: "text/javascript",
  mp3: "audio/mpeg",
  mp4: "video/mp4",
  mpeg: "video/mpeg",
  oga: "audio/ogg",
  ogv: "video/ogg",
  ogx: "application/ogg",
  opus: "audio/opus",
  otf: "font/otf",
  pdf: "application/pdf",
  png: "image/png",
  rtf: "application/rtf",
  svg: "image/svg+xml",
  tif: "image/tiff",
  tiff: "image/tiff",
  ts: "video/mp2t",
  ttf: "font/ttf",
  txt: "text/plain",
  wasm: "application/wasm",
  webm: "video/webm",
  weba: "audio/webm",
  webp: "image/webp",
  woff: "font/woff",
  woff2: "font/woff2",
  xhtml: "application/xhtml+xml",
  xml: "application/xml",
  zip: "application/zip",
  "3gp": "video/3gpp",
  "3g2": "video/3gpp2",
  gltf: "model/gltf+json",
  glb: "model/gltf-binary"
};

// node_modules/hono/dist/middleware/serve-static/index.js
var DEFAULT_DOCUMENT = "index.html";
var defaultPathResolve = (path) => path;
var serveStatic = (options) => {
  return async (c, next) => {
    if (c.finalized) {
      await next();
      return;
    }
    const url = new URL(c.req.url);
    let filename = options.path ?? decodeURI(url.pathname);
    filename = options.rewriteRequestPath ? options.rewriteRequestPath(filename) : filename;
    const root = options.root;
    let path = getFilePath({
      filename,
      root,
      defaultDocument: DEFAULT_DOCUMENT
    });
    if (!path) {
      return await next();
    }
    const getContent = options.getContent;
    const pathResolve = options.pathResolve ?? defaultPathResolve;
    path = pathResolve(path);
    let content = await getContent(path);
    if (!content) {
      let pathWithOutDefaultDocument = getFilePathWithoutDefaultDocument({
        filename,
        root
      });
      if (!pathWithOutDefaultDocument) {
        return await next();
      }
      pathWithOutDefaultDocument = pathResolve(pathWithOutDefaultDocument);
      content = await getContent(pathWithOutDefaultDocument);
      if (content) {
        path = pathWithOutDefaultDocument;
      }
    }
    if (content) {
      let mimeType;
      if (options.mimes) {
        mimeType = getMimeType(path, options.mimes) ?? getMimeType(path);
      } else {
        mimeType = getMimeType(path);
      }
      if (mimeType) {
        c.header("Content-Type", mimeType);
      }
      return c.body(content);
    }
    await options.onNotFound?.(path, c);
    await next();
    return;
  };
};

// node_modules/hono/dist/adapter/cloudflare-workers/utils.js
var getContentFromKVAsset = async (path, options) => {
  let ASSET_MANIFEST;
  if (options && options.manifest) {
    if (typeof options.manifest === "string") {
      ASSET_MANIFEST = JSON.parse(options.manifest);
    } else {
      ASSET_MANIFEST = options.manifest;
    }
  } else {
    if (typeof __STATIC_CONTENT_MANIFEST === "string") {
      ASSET_MANIFEST = JSON.parse(__STATIC_CONTENT_MANIFEST);
    } else {
      ASSET_MANIFEST = __STATIC_CONTENT_MANIFEST;
    }
  }
  let ASSET_NAMESPACE;
  if (options && options.namespace) {
    ASSET_NAMESPACE = options.namespace;
  } else {
    ASSET_NAMESPACE = __STATIC_CONTENT;
  }
  const key = ASSET_MANIFEST[path] || path;
  if (!key) {
    return null;
  }
  const content = await ASSET_NAMESPACE.get(key, { type: "arrayBuffer" });
  if (!content) {
    return null;
  }
  return content;
};

// node_modules/hono/dist/adapter/cloudflare-workers/serve-static.js
var serveStatic2 = (options) => {
  return async function serveStatic22(c, next) {
    const getContent = async (path) => {
      return getContentFromKVAsset(path, {
        manifest: options.manifest,
        namespace: options.namespace ? options.namespace : c.env ? c.env.__STATIC_CONTENT : void 0
      });
    };
    return serveStatic({
      ...options,
      getContent
    })(c, next);
  };
};

// node_modules/hono/dist/adapter/cloudflare-workers/serve-static-module.js
var module = (options) => {
  return serveStatic2(options);
};

// src/server.cloudflare.js
import manifest from "__STATIC_CONTENT_MANIFEST";
var app = createServer();
var setCacheAndCors = async (c, next) => {
  await next();
  c.res.headers.append("Cache-Control", "public, max-age=3600");
  c.res.headers.append("Access-Control-Allow-Origin", "*");
  c.res.headers.append("Access-Control-Allow-Methods", "GET,OPTIONS");
};
app.use("/cdn/*", setCacheAndCors);
app.use("/cdn/*", module({ root: "./", manifest }));
["explore", "decide", "checkout"].forEach((team) => {
  app.use(`/${team}/static/*`, setCacheAndCors);
  app.use(`/${team}/static/*`, module({ root: `./`, manifest }));
});
var server_cloudflare_default = app;

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
};
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
var jsonError = async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
};
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-Gfko8A/middleware-insertion-facade.js
server_cloudflare_default.middleware = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default,
  ...server_cloudflare_default.middleware ?? []
].filter(Boolean);
var middleware_insertion_facade_default = server_cloudflare_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}

// .wrangler/tmp/bundle-Gfko8A/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (worker.middleware === void 0 || worker.middleware.length === 0) {
    return worker;
  }
  for (const middleware of worker.middleware) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  };
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      };
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
function wrapWorkerEntrypoint(klass) {
  if (klass.middleware === void 0 || klass.middleware.length === 0) {
    return klass;
  }
  for (const middleware of klass.middleware) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  middleware_loader_entry_default as default
};
//# sourceMappingURL=server.cloudflare.js.map
