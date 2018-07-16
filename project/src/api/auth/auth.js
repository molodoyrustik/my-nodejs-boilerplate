import _ from 'lodash';
import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import Auth from '../../resourses/Auth/Auth';


export default (ctx) => {
  if (!_.has(ctx, 'resourses.Auth.signup')) throw '!resourses.Auth.signup'
  if (!_.has(ctx, 'resourses.Auth.login')) throw '!resourses.Auth.login'
  if (!_.has(ctx, 'resourses.Auth.validate')) throw '!resourses.Auth.validate'
  if (!_.has(ctx, 'resourses.Auth.forgot')) throw '!resourses.Auth.forgot'
  if (!_.has(ctx, 'resourses.Auth.checkForgotToken')) throw '!resourses.Auth.checkForgotToken'
  if (!_.has(ctx, 'resourses.Auth.reset')) throw '!resourses.Auth.reset'
	const api = AsyncRouter();

  api.all('/validate', ctx.resourses.Auth.validate);
  api.post('/signup', ctx.resourses.Auth.signup);
  api.post('/login', ctx.resourses.Auth.login);
  api.post('/forgot', ctx.resourses.Auth.forgot);
  api.get('/forgot/:forgotEmailToken', ctx.resourses.Auth.checkForgotToken);
  api.post('/reset', ctx.resourses.Auth.reset);


	return api;
}
