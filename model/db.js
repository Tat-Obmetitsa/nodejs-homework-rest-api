const mongoose = require('mongoose')
require('dotenv').config()
const uriDB = process.env.URI_DB

const db = mongoose.connect(uriDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, poolSize: 5 })

mongoose.connection.on('connected', () => {
    console.log(`Connection open ${uriDB}`)
})

mongoose.connection.on('error', (e) => {
    console.log(`Error mongoose connection ${e.message}`)
})

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
})

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('Connection to DB is closed and app is terminated')
    process.exit(1)
  })
})

module.exports = db