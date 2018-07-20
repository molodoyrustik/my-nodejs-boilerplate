import mongoose from 'mongoose'
import DomainSchema from './Domain';

export default (ctx) => {
  if (!ctx.log) throw '!log'

  return  mongoose.model('Domain', DomainSchema);
}
