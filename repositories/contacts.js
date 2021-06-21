const Contact = require('../model/contact')

const listContacts = async (userId, query) => {
  const {
    sortBy,
    sortByDesc,
    filter,
    favorite = false,
    limit = 10,
    offset = 0
  } = query
  const optionsSearch = { owner: userId }
  if(favorite) {optionsSearch.favorite = favorite }
  const results = await Contact.paginate(optionsSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    select: filter ? filter.split('|').join(' ') : '',
    populate: {
      path: 'owner',
      select: 'name email phone favorite subscription -_id'}})
  return results
}

const getContactById = async (userId, contactId) => {
  const results = await Contact.findOne({_id: contactId, owner: userId}).populate({path: 'owner',
    select: 'name email phone favorite subscription -_id'})
  return results
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findOneAndRemove({_id: contactId, owner: userId})
  return result
}

const addContact = async (userId, body) => {
  const result = await Contact.create({owner: userId, ...body})
  return result
}

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate({ _id: contactId, owner: userId }, {...body}, {new: true})
  return result
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
