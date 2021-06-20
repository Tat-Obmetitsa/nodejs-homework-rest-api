const { Schema, model } = require('mongoose');
const { Subscription } = require('../helpers/constants.js')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 8


const userSchema = new Schema(
 {
    email: {
      type: String,
      required: true,
      unique: true,
      validate(value) {
        const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g
        return re.test(String(value).toLocaleLowerCase())
        }
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    subscription: {
      type: String,
      enum: [Subscription.STARTER, Subscription.PRO, Subscription.BUSINESS],
      default: Subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        this.password =  await bcrypt.hash(this.password, salt)
    }
})

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const User = model('user', userSchema)

module.exports = User