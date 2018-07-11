import User from './User/User.js';

export default function () {
  return {
    User: User(...arguments),
  }
}
