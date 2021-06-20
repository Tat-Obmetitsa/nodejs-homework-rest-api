const express = require('express')
const router = express.Router()
const controller = require('../../../controllers/contacts')
const guard = require('../../../helpers/guard')


const {
  validateAddContact,
  validateUpdateStatusContact,
  validateUpdateContact,
  validateMongoId } = require('./validation')

router
  .get('/', guard, controller.listContacts)
  .post('/', guard, validateMongoId, validateAddContact, controller.addContact)

router
  .get('/:contactId', guard, validateMongoId, controller.getContactById)
  .delete('/:contactId', guard, validateMongoId, controller.removeContact)
  .put('/:contactId', guard, validateMongoId, validateUpdateContact, controller.updateContact)

router.patch('/:contactId/favorite', guard, validateMongoId, validateUpdateStatusContact, controller.updateStatusContact)

module.exports = router
