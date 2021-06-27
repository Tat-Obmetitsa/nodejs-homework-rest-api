const fs = require('fs/promises')
const jwt = require('jsonwebtoken')
const UploadAvatarService = require('../services/cloud-upload')
require('dotenv').config()
const Users = require('../repositories/users')
const { HttpCode } = require('../helpers/constants')
const EmailService = require('../services/email')
const {
    CreateSenderSendGrid,
    CreateSenderNodemailer
} = require('../services/email-sender')
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
      const {id, name, email, subscription, avatar, verifyToken} = await Users.createUser(req.body)
    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderSendGrid()
      );
      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }
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
      if (!user || !isValidPassword || !user.isVerified) {
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
    const id = req.user.id;
    const uploads = new UploadAvatarService();
    const { idCloudAvatar, avatarURL } = await uploads.saveAvatar(
      req.file.path,
      req.user.idCloudAvatar
    );

    await fs.unlink(req.file.path);

    await Users.updateAvatar(id, avatarURL, idCloudAvatar);
    res.json({ status: 'success', code: HttpCode.OK, data: { avatarURL } });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res, next) => {
  try {
    const user = await Users.findByVerifiedToken(req.params.token);
    if (user) {
      await Users.updateTokenVerify(user.id, true, null);
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: { message: 'Success' },
      });
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      message: 'Verification token is not valid',
    });
  } catch (error) {
    next(error);
  }
};
const repeatEmailVerification = async (req, res, next) => {
  try {
    const user = await Users.findByEmail(req.body.email);
    if (user) {
      const { name, email, isVerified, verifyToken } = user;
      if (!isVerified) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderSendGrid()
          // new CreateSenderNodemailer()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: 'success',
          code: HttpCode.OK,
          data: { message: 'Resubmitted success' },
        });
      }
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        message: 'Email has been verified',
      });
    }
    return res.status(HttpCode.NOT_FOUND).json({
      status: 'error',
      code: HttpCode.NOT_FOUND,
      message: 'User is not found',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
    register,
    login,
    logout,
    avatars,
    verify,
    repeatEmailVerification
}