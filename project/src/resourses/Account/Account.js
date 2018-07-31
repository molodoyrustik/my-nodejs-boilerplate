export default (ctx) => {
  const User = ctx.models.User;
  const Domain = ctx.models.Domain;

  let resourse = {};

  resourse.changePassword = async function(req, res) {
    const { password, repeatPassword } = req.body;
    if (!password || !repeatPassword) return res.status(404).json([{flag: false, message: "Вы не передали все данные"}])
    if (password !== repeatPassword) return res.status(404).json([{flag: false, message: "Пароли не совпадают"}])
    const userID = req.user.id;
    const user = await User.findOne({id: userID});
    user.password = password;
    await user.save();

    return res.json([{flag: true, message: 'Пароль успешно изменен'}]);
  }

  resourse.channels = async function(req, res) {
    const userID = req.user.id;
    const user = await User.findOne({id: userID});
    if (!user) return res.status(404).json([{flag: false, message: "Пользователь не найден"}])
    return res.json(user.channels);
  }

  return resourse
}
