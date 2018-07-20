import _ from 'lodash'
import mongoose from 'mongoose'

const DomainSchema = new mongoose.Schema({
  id: {
    type: String,
    index: { unique: true},
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  }
})

export default DomainSchema
