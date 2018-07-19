import Auth from './Auth/Auth';
import DomainController from './DomainController/DomainController';

export default function () {
  return {
    Auth: Auth(...arguments),
    DomainController: DomainController(...arguments),
  }
}
