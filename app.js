const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
require('dotenv').config()
const path = require('path')
const rateLimit = require('express-rate-limit')
const { limiterAPI } = require('./helpers/constants')
const  boolParser = require('express-query-boolean')
const { HttpCode } = require('./helpers/constants')
const AVATAR = process.env.AVATAR
const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'
app.use(helmet());
app.use(express.static(path.join(__dirname, AVATAR)))
app.get('emv') !== 'test' && app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json({ limit: 10000 }))
app.use(boolParser())
app.use('/api/', rateLimit(limiterAPI));

app.use('/api/', require('./routes/api/'))

app.use((req, res) => {
  res.status(HttpCode.NOT_FOUND)
    .json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'Not found'
    })
})

app.use((err, req, res, next) => {
  const status = err.status || HttpCode.INTERNAL_SERVER_ERROR
  res.status(status)
    .json({
      status: status === HttpCode.INTERNAL_SERVER_ERROR ? 'fail' : 'error',
      code: status,
      message: err.message
    })
})

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = app
