const Contacts = require('../repositories/contacts')
const { HttpCode } = require('../helpers/constants')

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id
    const {docs: contacts, ...rest} = await Contacts.listContacts(userId, req.query)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contacts,
          ...rest
        },
      })
  } catch (e) {
    next(e)
  }
}

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.getContactById(userId, req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact
        }
      })
    }
      return res.json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        mesage: 'Not found'
      })
  } catch (e) {
    next(e)
  }
}

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.addContact(userId, req.body);
    return res
      .status(HttpCode.CREATED)
      .json({ status: 'success', code: HttpCode.CREATED, data: { contact } });
  } catch (e) {
    if (e.name === 'ValidationError') {
      e.status = HttpCode.BAD_REQUEST
    }
    next(e);
  }
}

const removeContact = async (req, res, next) => {
  try {
    const userId = req.user.id
    const contact = await Contacts.removeContact(userId, req.params.contactId)
    if (contact) {
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        data: {
          contact
        }
      })
    }
      return res.json({
        status: 'error',
        code: HttpCode.NOT_FOUND,
        mesage: 'Not found'
      })
  } catch (e) {
    next(e)
  }
}

const updateContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.updateContact(userId, req.params.contactId,req.body);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { contact },
      });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
  } catch (e) {
    next(e);
  }
}
const updateStatusContact = async (req, res, next) => {
    try {
    const userId = req.user.id;
    const contactFavorite = await Contacts.updateContact(userId, req.params.contactId,req.body);
    if (contactFavorite) {
      return res.status(HttpCode.OK).json({
        status: 'success',
        code: HttpCode.OK,
        data: { contactFavorite },
      });
    }
    return res
      .status(HttpCode.NOT_FOUND)
      .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
  } catch (e) {
    next(e);
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