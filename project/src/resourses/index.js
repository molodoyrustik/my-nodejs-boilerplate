import Auth from './Auth/Auth';

export default function () {
  return {
    Auth: Auth(...arguments),
  }
}

