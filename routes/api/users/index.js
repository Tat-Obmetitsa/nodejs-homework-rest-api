const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/users')
const guard = require('../../../helpers/guard')
const upload = require('../../../helpers/upload')

const {
  validateAddUser,
  validateLoginUser } = require('./validation')

router.post('/register', validateAddUser, controller.register)
router.post('/login', validateLoginUser,  controller.login)
router.post('/logout', guard, controller.logout)
router.patch('/avatars', guard, upload.single('avatar'), controller.avatars)

router.get('/verify/:token', controller.verify);
router.post('/verify', controller.repeatEmailVerification);

module.exports = router
