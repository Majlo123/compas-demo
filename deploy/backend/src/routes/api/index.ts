import config from 'config/config';
import * as Package from 'docs/package';
import { swaggerDocs } from 'docs/swagger';
import express from 'express';
import { Router } from 'express-serve-static-core';
import createOrganizationRoute from 'routes/api/organization.route';
import createAuthRoute from 'routes/api/auth.route';
import createLeaveRequestRoute from 'routes/api/leaveRequest.route';
import createTeamRoute from 'routes/api/team.route';
import createUserRoute from 'routes/api/user.route';
import createUserInviteRoute from 'routes/api/userInvite.route';
import createNotificationRoute from 'routes/api/notification.route';
import createCollectiveDayOffRoute from 'routes/api/collectiveDayOff.route';
import createWidgetRoute from 'routes/api/widget.route';
import createTimeEntryRoute from 'routes/api/timeEntry.route';

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
  {
    path: '/leave-request',
    route: createLeaveRequestRoute('/leave-request'),
  },
  {
    path: '/team',
    route: createTeamRoute('/team'),
  },
  {
    path: '/user',
    route: createUserRoute('/user'),
  },
  {
    path: '/user-invite',
    route: createUserInviteRoute('/user-invite'),
  },
  {
    path: '/notifications',
    route: createNotificationRoute('/notifications'),
  },
  {
    path: '/collective-days-off',
    route: createCollectiveDayOffRoute('/collective-days-off'),
  },
  {
    path: '/widgets',
    route: createWidgetRoute('/widgets'),
  },
  {
    path: '/time-entries',
    route: createTimeEntryRoute('/time-entries'),
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
    title: 'Vacation Tracker API',
    description: 'This is an API for Vacation Tracker',
    version: Package.version(),
    serverUrl: config.server.api_url,
  });
};

addRoutes(apiRouter, defaultRoutes);

export default apiRouter;
