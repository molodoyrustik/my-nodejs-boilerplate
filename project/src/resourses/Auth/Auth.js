import jwt from 'express-jwt'
import uniqid from 'uniqid';
import crypto from 'crypto';

export function canonize(str) {
  return str.toLowerCase().trim()
}

export default (ctx) => {
  const User = ctx.models.User
  const Token = ctx.models.Token
  const transporter = ctx.transporter;

  const resourse = {}

  resourse.validate = async function (req, res) {
    if(req.user) {
      const user = await User.findById(req.user._id)
      if (!user) return res.status(404).json([{validate: false, message: 'Пользователь не найден в базе'}]);
      return {
        validate: true,
        __pack: 1,
        jwt: req.user,
        user: user,
      }
    }
    return res.status(404).json([{validate: false, message: 'Пользователь не найден в базе'}]);
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
      if (existUser) return res.status(400).json([{signup: false, message: 'Такой email зарегистрирован'}])

      const user = new User({ ...userFields, id: uniqid() })
      await user.save()
      const userToken = new Token({ userID: user.id , id: uniqid(), forgotEmailToken: '' })
      await userToken.save();

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
    const params = resourse.getUserFields(req, res);
    if (!params.password) return res.status(400).json([{login: false, message: 'Параметр password не передан'}]);

    const criteria = resourse.getUserCriteria(req);
    const user = await User.findOne(criteria);

    if (!user) return res.status(404).json([{login: false, message: 'Такой пользователь не найден'}]);

    if (!await user.verifyPassword(params.password)) {
      return res.status(400).json([{login: false, message: 'Переданный пароль не подходит'}]);
    }

    return res.json([{
      __pack: 1,
      login: true,
      user,
      token: user.generateAuthToken(),
    }])
  }

  resourse.forgot = async function (req, res) {
    const params = resourse.getUserFields(req, res);

    if (!params.email) return res.status(400).json([{ forgot: false, message: 'Параметр email не передан' }]);
    if (!params.captcha) return res.status(400).json([{ forgot: false, message: 'Параметр captcha не передан' }]);

    const criteria = resourse.getUserCriteria(req);
    const user = await User.findOne(criteria);

    if (!user) return res.status(404).json([{login: false, message: 'Пользователь с таким email не найден в базе'}]);

    const token = await crypto.randomBytes(32);
    const userToken = await Token.findOne({userID: user.id})
    userToken.forgotEmailToken = token.toString('hex');
    await userToken.save();


    let mailText = `Перейдите по ссылке чтобы изменить пароль http://localhost:3000/auth/forgot/${userToken.forgotEmailToken}`;

    var mailOptions = {
      from: 'molodoyrustik@mail.ru',
      to: user.email,
      subject: 'Восстановления пароля сайта Ashile.io',
      text: mailText
    };
    await transporter.sendMail(mailOptions);

    const result = [{
      __pack: 1,
      forgot: true
    }];
    return res.json(result);
  }

  resourse.checkForgotToken = async function (req, res) {
    const { forgotEmailToken } = req.params;
    if (!forgotEmailToken) {
      return res.status(400).json([{checkForgotToken: false, message: 'Токен не был передан'}]);
    }

    const criteria = { forgotEmailToken };
    const userToken = await Token.findOne(criteria);

    if (!userToken) return res.status(404).json([{checkForgotToken: false, message: 'Пользователь с таким токеном не найден'}]);

    return res.json([{
        __pack: 1,
        checkForgotToken: true
    }]);
  }

  resourse.reset = async function (req, res) {
    const params = resourse.getUserFields(req, res);
    const { password, checkPassword, captcha, forgotEmailToken, } = params;

    if (!password) return res.status(400).json([{reset: false, message: 'Параметр password не передан'}]);
    if (!checkPassword) return res.status(400).json([{reset: false, message: 'Параметр checkPassword не передан'}]);
    if (password !== checkPassword) return res.status(400).json([{reset: false, message: 'Пароли не совпадают'}]);
    if (!captcha) return res.status(400).json([{reset: false, message: 'Параметр captcha не передан'}]);
    if (!forgotEmailToken) return res.status(400).json([{reset: false, message: 'Параметр forgotEmailToken не передан'}]);

    const criteria = { forgotEmailToken };
    const userToken = await Token.findOne(criteria);
    if (!userToken) return res.status(404).json([{reset: false, message: 'Не корректный токен'}]);
    const { userID } = userToken;
    userToken.forgotEmailToken = '';
    await userToken.save();

    const user = await User.findOne({id: userID});
    if (!user) return res.status(404).json([{reset: false, message: 'Такой пользователь не найден'}]);
    user.password = password;
    await user.save();

    return res.json([{
      __pack: 1,
      reset: true
    }])
  }

  resourse.getToken = function (req) {
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
