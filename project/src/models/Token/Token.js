import _ from 'lodash'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Promise from 'bluebird'
const bcryptGenSalt = Promise.promisify(bcrypt.genSalt)
const bcryptHash = Promise.promisify(bcrypt.hash)
const bcryptCompare = Promise.promisify(bcrypt.compare)
import mongoose from 'mongoose'

export default (ctx) => {
  if (!ctx.log) throw '!log'

  const schema = new mongoose.Schema({
    id: {
      type: String,
      index: { unique: true},
      trim: true,
    },
    userID: {
      type: String,
      index: { unique: true},
      trim: true,
    },
    forgotEmailToken: {
      type: String,
      trim: true,
    },
  }, {
    collection: 'token',
    timestamps: true,
  })

  return mongoose.model('Token', schema);
}
