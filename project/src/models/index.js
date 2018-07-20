import User from './User/User.js';
import Token from './Token/Token.js';
import DomainObject from './Domain/Domain';



export default function () {
  return {
    Domain: DomainObject.Domain(...arguments),
    User: User(...arguments),
    Token: Token(...arguments),
    scheme: {
      DomainSchema: DomainObject.DomainSchema,
    }
  }
}
