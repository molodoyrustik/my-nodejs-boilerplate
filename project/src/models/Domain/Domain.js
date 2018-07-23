import _ from 'lodash'
import mongoose from 'mongoose'

const LogSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
  }
})

const DomainSchema = new mongoose.Schema({
  id: {
    type: String,
    trim: true,
  },
  url: {
    type: String,
    trim: true,
  },
  logs: [LogSchema],
})

export default DomainSchema
