import jwt from 'express-jwt'

export function canonize(str) {
  return str.toLowerCase().trim()
}

export default (ctx) => {
  const User = ctx.models.User
  const resourse = {}

  resourse.validate = async function (req, res) {
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json([{signup: false, message: 'Не найден user в базе'}]);
    return {
      __pack: 1,
      jwt: req.user,
      user: user,
    }
  }

  resourse.getUserFields = function (req) {
    return req.body;
  }

  resourse.validationUserFields = function(userFields, res) {
    let valid = {
      isValid: false,
      message: []
    }

    if(!userFields.captcha) {
      valid.isValid = true;
      valid.message = [{signup: false, message: 'Параметр captcha не передан или введен неверно'}]
    }

    if(!userFields.email || !userFields.password) {
      valid.isValid = true;
      valid.message = [{signup: false, message: 'Параметрs email или password не передан'}]
    }

    return valid;
  }

  resourse.getUserCriteria = function (req, res) {
    const params = req.body
    if (params.email) {
      return {
        email: params.email,
      }
    }
    return res.status(400).json([{signup: false, message: 'Параметр email не передан'}]);
  }

  resourse.signup = async function (req, res) {
    try {
      const userFields = resourse.getUserFields(req, res);
      const valid = resourse.validationUserFields(userFields, res);
      if (valid.isValid) {
        return res.status(400).json(valid.message);
      }
      const criteria = resourse.getUserCriteria(req, res);

      const existUser = await User.findOne(criteria)
      if (existUser) return res.status(400).json([{signup: false, message: 'Username with this email is registered'}])

      const user = new User(userFields)
      await user.save()

      const result = [{
        signup: true,
        user,
        token: user.generateAuthToken(),
      }]

      return res.json(result)

    } catch(err) {
      console.log(err);
      return res.status(500).json(err)
    }
  }

  resourse.login = async function (req, res) {
    const params = resourse.getUserFields(req, res)
    if (!params.password) return res.status(400).send('Параметр password не передан')

    const criteria = resourse.getUserCriteria(req)
    const user = await User.findOne(criteria)

    if (!user) return res.status(404).send('Такой пользователь не найден')

    if (!await user.verifyPassword(params.password)) {
      return res.status(400).send('Переданный пароль не подходит')
    }

    return res.json({
      __pack: 1,
      user,
      token: user.generateAuthToken(),
    })
  }

  resourse.getToken = function (req) {
    console.log(req.headers)
    if (req.headers.authorization && req.headers.authorization.split( ' ' )[ 0 ] === 'Bearer') {
      return req.headers.authorization.split( ' ' )[ 1 ]
    } else if (req.headers['x-access-token']) {
      return req.headers['x-access-token'];
    } else if ( req.query && req.query.token ) {
      return req.query.token
    } else if ( req.cookies && req.cookies.token  ) {
      return req.cookies.token
    }
    if (__DEV__ && ctx.config && ctx.config.jwt && ctx.config.jwt.devToken) return ctx.config.jwt.devToken
    return null;
  }

  resourse.parseToken = function (req, res, next) {
    const token = resourse.getToken(req)
    req.token = token
    next()
  }

  resourse.parseUser = function (req, res, next) {
    const options = {
      secret: ctx.config && ctx.config.jwt.secret || 'SECRET',
      getToken: req => req.token,
    }
    jwt(options)(req, res, (err) => {
      if (err) req._errJwt = err
      next()
    })
  }

  resourse.isAuth = function (req, res, next) {
    if (req._errJwt) return next(req._errJwt)
    if (!req.user || !req.user._id) return res.status(401).send('!req.user')
    next()
  }

  return resourse
}
