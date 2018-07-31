import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import Domain from '../../resourses/Domain/Domain';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.Domain.domains')) throw '!resourses.Domain.domains'
  if (!_.has(ctx, 'resourses.Domain.create')) throw '!resourses.Domain.create'
  if (!_.has(ctx, 'resourses.Domain.delete')) throw '!resourses.Domain.delete'
  if (!_.has(ctx, 'resourses.Domain.edit')) throw '!resourses.Domain.edit'
  if (!_.has(ctx, 'resourses.Domain.edit')) throw '!resourses.Domain.logs'

	const api = AsyncRouter();

  api.get('/', ctx.resourses.Domain.domains);
  api.post('/create', ctx.resourses.Domain.create);
  api.delete('/delete/:id', ctx.resourses.Domain.delete);
  api.put('/edit', ctx.resourses.Domain.edit);
  api.get('/:domainId/logs', ctx.resourses.Domain.logs);

	return api;
}
