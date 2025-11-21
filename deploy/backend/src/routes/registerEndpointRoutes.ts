import { EndpointMeta, registerSwaggerPath } from 'docs/swagger';
import { Router, RequestHandler } from 'express';
import { authorize, checkJobApiKey } from 'middlewares/authorization';
import noCacheHeaders from 'middlewares/noCacheHeaders';
import parseQueryParams from 'middlewares/parseQueryParams';
import { validateRequestBody, validateQueryParams } from 'middlewares/requestValidation';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

const registerEndpointRoutes = (
  router: Router,
  endpoints: EndpointMeta[],
  controllerFunctions: Record<string, RequestHandler>,
): void => {
  const methodMap: Record<HttpMethod, (path: string, ...handlers: RequestHandler[]) => Router> = {
    get: router.get.bind(router),
    post: router.post.bind(router),
    put: router.put.bind(router),
    delete: router.delete.bind(router),
    patch: router.patch.bind(router),
  };

  endpoints.forEach((endpoint) => {
    const handler = controllerFunctions[endpoint.functionName];
    if (!handler) {
      throw new Error(`Handler for function "${endpoint.functionName}" not found`);
    }

    const methodFunc = methodMap[endpoint.method];
    if (!methodFunc) {
      throw new Error(`Unsupported HTTP method: ${endpoint.method}`);
    }

    const middleware: RequestHandler[] = [];

    if (endpoint.authorize) {
      middleware.push(authorize(endpoint.allowedRoles));
    }

    if (endpoint.querySchema) {
      middleware.push(validateQueryParams(endpoint.querySchema));
      middleware.push(parseQueryParams);
    }

    if (endpoint.requestBodySchema) {
      middleware.push(validateRequestBody(endpoint.requestBodySchema));
    }

    if (endpoint.noCacheHeaders) {
      middleware.push(noCacheHeaders);
    }

    if (endpoint.requireApiKey) {
      middleware.push(checkJobApiKey);
    }

    middleware.push(handler);

    methodFunc(endpoint.path, ...middleware);

    registerSwaggerPath(endpoint);
  });
};

export default registerEndpointRoutes;
