import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import DomainController from '../../resourses/DomainController/DomainController';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.DomainController.domains')) throw '!resourses.DomainController.domains'
  if (!_.has(ctx, 'resourses.DomainController.create')) throw '!resourses.DomainController.create'
  if (!_.has(ctx, 'resourses.DomainController.delete')) throw '!resourses.DomainController.delete'
  if (!_.has(ctx, 'resourses.DomainController.edit')) throw '!resourses.DomainController.edit'
  if (!_.has(ctx, 'resourses.DomainController.edit')) throw '!resourses.DomainController.logs'

	const api = AsyncRouter();

  api.get('/', ctx.resourses.DomainController.domains);
  api.post('/create', ctx.resourses.DomainController.create);
  api.delete('/delete/:id', ctx.resourses.DomainController.delete);
  api.put('/edit', ctx.resourses.DomainController.edit);
  api.get('/:domainId/logs', ctx.resourses.DomainController.logs);

	return api;
}
