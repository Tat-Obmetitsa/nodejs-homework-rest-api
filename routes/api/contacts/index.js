const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/contacts')

const {
  validateAddContact,
  validateUpdateStatusContact,
  validateUpdateContact,
  validateMongoId } = require('./validation')

router
  .get('/', validateMongoId, controller.listContacts)
  .post('/', validateMongoId, validateAddContact, controller.addContact)

router
  .get('/:contactId', validateMongoId, controller.getContactById)
  .delete('/:contactId', validateMongoId, controller.removeContact)
  .put('/:contactId', validateMongoId, validateUpdateContact, controller.updateContact)

router.patch('/:contactId/favorite', validateMongoId, validateUpdateStatusContact, controller.updateStatusContact)

module.exports = router
