import User from './User/User.js';
import Token from './Token/Token.js';
import DomainSchema from './Domain/Domain';
import Domain from './Domain/DomainModel';

export default function () {
  return {
    Domain: Domain(...arguments),
    User: User(...arguments),
    Token: Token(...arguments),
    scheme: {
      DomainSchema,
    }
  }
}
