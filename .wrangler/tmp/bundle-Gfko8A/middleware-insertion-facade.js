				import worker, * as OTHER_EXPORTS from "/Users/michael/Lab/tractor-store-blueprint/src/server.cloudflare.js";
				import * as __MIDDLEWARE_0__ from "/Users/michael/Lab/tractor-store-blueprint/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts";
import * as __MIDDLEWARE_1__ from "/Users/michael/Lab/tractor-store-blueprint/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts";
				
				worker.middleware = [
					__MIDDLEWARE_0__.default,__MIDDLEWARE_1__.default,
					...(worker.middleware ?? []),
				].filter(Boolean);
				
				export * from "/Users/michael/Lab/tractor-store-blueprint/src/server.cloudflare.js";
				export default worker;