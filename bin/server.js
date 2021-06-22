  
const app = require('../app')
const db = require('../model/db')
const createFolderNotExist = require('../helpers/create-folder')
require('dotenv').config()

const PORT = process.env.PORT || 3000
const UPLOAD_DIR = process.env.UPLOAD_DIR
const AVATAR = process.env.AVATAR

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderNotExist(UPLOAD_DIR)
    await createFolderNotExist(AVATAR)
    console.log(`Server is running. Use our API on port: ${PORT}`)
  })
}).catch(err => {
  console.log(`Server is not running. Error message: ${err.message}`)
})

