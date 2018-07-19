import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import DomainController from '../../resourses/DomainController/DomainController';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.DomainController.domains')) throw '!resourses.DomainController.domains'

	const api = AsyncRouter();

  api.get('/domains', ctx.resourses.DomainController.domains);

	return api;
}
