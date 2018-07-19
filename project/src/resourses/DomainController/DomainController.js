import jwt from 'express-jwt'
import uniqid from 'uniqid';

export default (ctx) => {
  const User = ctx.models.User;
  let DomainController = {};

  DomainController.domains = async function(req, res) {
    const userID = req.user.id;
    const user = await User.findOne({id: userID});
    if(!user) return res.status(400).json([{ flag: false, type: 'error', messageText: 'Невалидный токен'} ]);
    console.log(userID);
    return res.json(user.domains);
  }

  return DomainController
}
