const { expectCt } = require('helmet')
const { updateContact } = require('../controllers/contacts')
const Contacts = require('../repositories/contacts')

jest.mock('../repositories/contacts')

describe('Unit test controller contacts', () => {
    const req = {user: { id:1}, body: {}, params: {id: 1}}
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn((data) => data)
    }
    const next = jest.fn()
    test('test update contact right', async () => {
        const contact = {id: 3, name: 'Alison', email: 'example@gmail.com', phone: '0930009988'}
        Contacts.updateContact = jest.fn(() => {
            return contact
        })
        const result = await updateContact(req, res, next)
        expect(result).toBeDefined();
        expect(result.status).toEqual('success')
        expect(result.code).toEqual(200)
        expect(result.data.contact).toEqual(contact)
    })
    test('test update contact can not exist', async () => {
        Contacts.updateContact = jest.fn();
        const result = await updateContact(req, res, next)
        expect(result).toBeDefined();
        expect(result.status).toEqual('error');
        expect(result.code).toEqual(404);
        expect(result.message).toEqual('Not found');
    })
    test('test update contact repositories return Error', async () => {
        Contacts.updateContact = jest.fn(() => {
            throw new Error('Error')
        });
        await updateContact(req, res, next)
        expect(next).toHaveBeenCalled()
    })
})



