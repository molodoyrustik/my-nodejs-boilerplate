import mongoose from 'mongoose';
import { AsyncRouter } from 'express-async-router';
import expressJwt from 'express-jwt';
import getAuth from './auth/auth';
import getDomain from './domain/domain';

export default (ctx) => {
	const api = AsyncRouter();

  api.all('/', () => ({ok: true, version: '1.0.1'}))

  api.use('/auth', getAuth(ctx));
	api.use('/dashboard', expressJwt({secret: ctx.config.jwt.secret}), getDomain(ctx));


	// api.all('/protected', expressJwt({secret: ctx.config.jwt.secret}), (req, res, next) => {
	// 	return req.user;
	// })
	// api.all('/domains', expressJwt({secret: ctx.config.jwt.secret}), (req, res, next) => {
	// 	return req.user.domains;
	// })


	return api;
}
