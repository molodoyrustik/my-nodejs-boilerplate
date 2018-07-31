import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import Account from '../../resourses/Account/Account';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.Account.changePassword')) throw '!resourses.Account.changePassword';
  if (!_.has(ctx, 'resourses.Account.channels')) throw '!resourses.Account.channels'

	const api = AsyncRouter();

  api.post('/changePassword', ctx.resourses.Account.changePassword);
  api.get('/channels', ctx.resourses.Account.channels);


	return api;
}
