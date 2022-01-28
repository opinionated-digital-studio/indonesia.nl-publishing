import mongoose from 'mongoose'
import { dbConnectionString } from '../../config'

mongoose.connect(dbConnectionString)

const connection = mongoose.connection

connection.on('connection', () => {
  console.log('connected to db')
})

connection.on('error', (error) => {
  console.log(error)
  console.log('error connecting to db')
})
