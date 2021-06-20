const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/users')
const guard = require('../../../helpers/guard')

const {
  validateAddUser,
  validateLoginUser } = require('./validation')

router.post('/register', validateAddUser, controller.register)
router.post('/login', validateLoginUser,  controller.login)
router.post('/logout', guard, controller.logout)

module.exports = router
