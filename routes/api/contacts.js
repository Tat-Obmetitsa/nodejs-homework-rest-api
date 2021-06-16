const express = require('express')
const router = express.Router()
const Contacts = require('../../model')

router.get('/', async (req, res, next) => {
  try {
    const contacts = await Contacts.listContacts()
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contacts,
        },
      })
  } catch (e) {
    next(e)
  }
})

router.get('/:contactId', async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact
        }
      })
    }
      return res.json({
        status: 'error',
        code: 404,
        mesage: 'Not found'
      })
  } catch (e) {
    next(e)
  }
})

router.post("/", async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    next(e);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.patch('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
