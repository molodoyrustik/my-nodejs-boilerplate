import User from './User/User.js';
import Token from './Token/Token.js';
import Domain, { DomainSchema } from './Domain/Domain';



export default function () {
  return {
    Domain: Domain(...arguments),
    User: User(...arguments),
    Token: Token(...arguments),
    scheme: {
      DomainSchema: DomainSchema,
    }
  }
}
