const Contacts = require('../repositories/contacts')

const listContacts = async (req, res, next) => {
  try {
    console.log(req.user)
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
}

const getContactById = async (req, res, next) => {
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
}

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res
      .status(201)
      .json({ status: "success", code: 201, data: { contact } });
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = 400
    }
    next(e);
  }
}

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId)
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
}

const updateContact  = async (req, res, next) => {
    try {
    const contact = await Contacts.updateContact(req.params.contactId, req.body)
    if (contact) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contact,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        data: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}
const updateStatusContact  = async (req, res, next) => {
    try {
    const contactFavorite = await Contacts.updateContact(req.params.contactId, req.body)
    if (contactFavorite) {
      return res.json({
        status: 'success',
        code: 200,
        data: {
          contactFavorite,
        },
      })
    } else {
      return res.status(404).json({
        status: 'error',
        code: 404,
        message: 'Not found',
      })
    }
  } catch (e) {
    next(e)
  }
}
module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact
}