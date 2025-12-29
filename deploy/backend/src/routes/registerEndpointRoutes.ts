import { setupSwagger, EndpointMeta } from 'docs/swagger';
import { Router, RequestHandler } from 'express';

/**
 * Register endpoint routes with Swagger documentation
 */
const registerEndpointRoutes = (
  router: Router,
  endpointsMeta: EndpointMeta[],
  handlers: Record<string, RequestHandler>,
): void => {
  endpointsMeta.forEach((meta) => {
    const method = meta.method.toLowerCase() as keyof Router;
    const { path } = meta;
    const handler = handlers[meta.functionName];

    if (!handler) {
      console.warn(`Handler for ${meta.functionName} not found`);
      return;
    }

    // Register the route
    (router[method] as any)(path, handler);
  });

  // Setup Swagger documentation
  setupSwagger(router, endpointsMeta);
};

export default registerEndpointRoutes;
