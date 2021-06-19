const { Schema, model } = require('mongoose');

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
{
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id
      return ret
    },
  },
},
)

contactSchema.path('name').validate((value) => {
  const re = /[A-Z]\w+/g
  return re.test(String(value))
})

contactSchema.virtual('strAge').get(function () {
  return `${this.phone}`
})

const Contact = model('contact', contactSchema)

module.exports = Contact