import 'express';

import QueryParams from 'repos/utils/query/QueryParams';

declare global {
  namespace Express {
    interface Request {
      queryParams: QueryParams;
      user?: {
        id: string;
        role: string;
      };
    }
  }
}
