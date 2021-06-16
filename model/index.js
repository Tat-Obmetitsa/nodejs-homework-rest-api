const fs = require('fs/promises')
const path = require('path')
const { v4: uuid } = require("uuid")

const readData = async () => {
  const data = await fs.readFile(
    path.join(__dirname, "contacts.json"),
    "utf-8"
  );

  return JSON.parse(data);
};

const listContacts = async () => {
  return await readData()
}

const getContactById = async (contactId) => {
  const data = await readData();
  const [result] = data.filter((contact) => contact.id === contactId);
  return result;
};

const removeContact = async (contactId) => {}

const addContact = async (body) => {
  const id = uuid()
  const record = {
    id,
    ...body,
    ...(body.isVaccinated ? {} : {isVaccinated: false})
  }
  const data = await readData()
  data.push(record)
  await fs.writeFile(path.join(__dirname, 'contacts.json'), JSON.stringify(data))
  return record
}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
