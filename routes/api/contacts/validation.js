const Joi = require('joi');
const mongoose = require('mongoose')

const schemaAddContact = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .required(),

    favorite: Joi.boolean().optional(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'io'] } }).required(),
    phone: Joi.string().pattern(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/).required()
})
const schemaUpdateContact = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(10)
        .optional(),

    favorite: Joi.boolean().optional(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'ua', 'io'] } }).optional(),
    phone: Joi.string().pattern(/^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/).optional()
}).or('name', 'favorite', 'email', 'phone')

const schemaUpdateStatusContact = Joi.object({
  favorite: Joi.boolean().required().messages({
    'any.required': "Missing 'favorite' field.",
  }),
});

const validate = async (schema, obj, next) => {
    try {
        await schema.validateAsync(obj)
        return next()
    } catch (err) {
        console.log(err)
        next({ status: 400, message: err.message.replace(/"/g, " ")})
     }
}

module.exports = {
    validateAddContact: async (req, res, next) => {
        return await validate(schemaAddContact, req.body, next)
    },
    validateUpdateStatusContact: async (req, res, next) => {
        return await validate(schemaUpdateStatusContact, req.body, next)
    },
    validateUpdateContact: async (req, res, next) => {
        return await validate(schemaUpdateContact, req.body, next)
    },
    validateMongoId: async (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params.contactId)) {
      next({ status: 400, message: 'Invalid id'})
    }
    next()
  },
}