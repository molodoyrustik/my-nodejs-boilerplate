import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import Channel from '../../resourses/Channel/Channel';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.Channel.getChannels')) throw '!resourses.Channel.getChannels'
  if (!_.has(ctx, 'resourses.Channel.create')) throw '!resourses.Channel.create'

	const api = AsyncRouter();

  api.get('/', ctx.resourses.Channel.getChannels);
  api.post('/create', ctx.resourses.Channel.create);
  api.put('/edit', ctx.resourses.Channel.edit);
  api.delete('/delete/:id', ctx.resourses.Channel.delete);

	return api;
}
