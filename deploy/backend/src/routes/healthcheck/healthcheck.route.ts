import { Router } from 'express';
import httpStatus from 'http-status';
import * as process from 'process';

const healthcheckRouter = Router();

interface IHealthcheckResponse {
  uptime: number;
  message: string;
  date: Date;
}

healthcheckRouter.route('/healthcheck').get((_, res) => {
  const data: IHealthcheckResponse = {
    uptime: process.uptime(),
    message: 'OK',
    date: new Date(),
  };

  res.status(httpStatus.OK).send(data);
});

export default healthcheckRouter;
