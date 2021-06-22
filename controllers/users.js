const Users = require('../repositories/users')
const { HttpCode } = require('../helpers/constants')
const jwt = require('jsonwebtoken')
const UploadAvatarService = require('../services/local-upload')
require('dotenv').config()
const KEY = process.env.KEY

const register = async (req, res, next) => {
  try {
      const user = await Users.findByEmail(req.body.email)
      if (user) {
        return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email is already used'
      })
      }
      const {id, name, email, subscription, avatar} = await Users.createUser(req.body)

      return res.status(HttpCode.CREATED).json({
        status: 'success',
        code: HttpCode.CREATED,
        data: { id, name, email, subscription, avatar },
      })
  } catch (e) {
    next(e)
  }
}
const login = async (req, res, next) => {
  try {
      const user = await Users.findByEmail(req.body.email)
      const isValidPassword = await user?.isValidPassword(req.body.password)
      if (!user || !isValidPassword) {
        return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Invalid credential'
      })
      }
      const id = user.id
      const payload = { id, test: 'You logged in' }
      const token = jwt.sign(payload, KEY, { expiresIn: '2h' })
      await Users.updateToken(id, token)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          token,
        },
      })
  } catch (e) {
    next(e)
  }
}
const logout = async (req, res, next) => {
  const id = req.user.id
  try {
    await Users.updateToken(id, null)
      return res.status(HttpCode.NO_CONTENT).json({})
  } catch (e) {
    next(e)
  }
}

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const uploads = new UploadAvatarService(process.env.AVATAR)
    const avatarURL = await uploads.saveAvatar({ id: id, file: req.file })
   
    // TODO: need delete old avatar

    await Users.updateAvatar(id, avatarURL)
    res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarURL
      }
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
    register,
    login,
    logout,
    avatars
}