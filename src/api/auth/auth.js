import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import Auth from './Auth';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.Auth.signup')) throw '!resourses.Auth.signup'
  if (!_.has(ctx, 'resourses.Auth.login')) throw '!resourses.Auth.login'
  if (!_.has(ctx, 'resourses.Auth.validate')) throw '!resourses.Auth.validate'
	const api = AsyncRouter();

  api.all('/validate', ctx.resourses.Auth.validate);
  api.post('/signup', ctx.resourses.Auth.signup);
  api.post('/login', ctx.resourses.Auth.login);

	return api;
}
