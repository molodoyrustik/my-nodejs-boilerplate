import User from './User/User.js';
import Token from './Token/Token.js';

export default function () {
  return {
    User: User(...arguments),
    Token: Token(...arguments),
  }
}
