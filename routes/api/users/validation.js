const Joi = require('joi')
const { HttpCode } = require('../../../helpers/constants')

const schemaAddUser = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'io'] } }).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().optional(),
})
const schemaLoginUser = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(6).required(),
});

const validate = async (schema, obj, next) => {
    try {
        await schema.validateAsync(obj)
        return next()
    } catch (err) {
        console.log(err)
        next({ status: HttpCode.BAD_REQUEST, message: err.message.replace(/"/g, " ")})
     }
}

module.exports = {
    validateAddUser: async (req, res, next) => {
        return await validate(schemaAddUser, req.body, next)
    },
    validateLoginUser: async (req, res, next) => {
        return await validate(schemaLoginUser, req.body, next)
    }
}