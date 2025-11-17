import config from 'config/config';
import * as Package from 'docs/package';
import { swaggerDocs } from 'docs/swagger';
import express from 'express';
import { Router } from 'express-serve-static-core';
import createOrganizationRoute from 'routes/api/organization.route';
import createAuthRoute from 'routes/api/auth.route';

const apiRouter = express.Router();

const defaultRoutes: { path: string; route: any }[] = [
  {
    path: '/auth',
    route: createAuthRoute('/auth'),
  },
  {
    path: '/organization',
    route: createOrganizationRoute('/organization'),
  },
];

const addRoutes = (router: Router, routes: any[]): void => {
  routes.forEach((route) => {
    if (Array.isArray(route.route)) {
      // If the route has nested routes, recursively add them
      const nestedRouter = express.Router();
      addRoutes(nestedRouter, route.route);
      router.use(route.path, nestedRouter);
    } else {
      router.use(route.path, route.route);
    }
  });

  swaggerDocs(router, {
    title: 'The [Enter app name] API',
    description: 'This is an API for [Enter app name]',
    version: Package.version(),
    serverUrl: config.server.api_url,
  });
};

addRoutes(apiRouter, defaultRoutes);

export default apiRouter;
