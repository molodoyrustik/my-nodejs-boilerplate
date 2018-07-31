import Auth from './Auth/Auth';
import Domain from './Domain/Domain';
import Account from './Account/Account';
import Channel from './Channel/Channel';

export default function () {
  return {
    Auth: Auth(...arguments),
    Domain: Domain(...arguments),
    Account: Account(...arguments),
    Channel: Channel(...arguments),
  }
}
