const request = require('supertest');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const app = require('../app');
const db = require('../model/db');
const User = require('../model/user');
const Contact = require('../model/contact');
const Users = require('../repositories/users');
const { newUser, newContact } = require('./data/data');
const {HttpCode} = require('../helpers/constants')

describe('Test route contacts', () => {
  let user, token;

  beforeAll(async () => {
    await db;
    await User.deleteOne({ email: newUser.email });
    user = await User.create(newUser);
    const KEY = process.env.KEY;
    const issueToken = (payload, secret) => jwt.sign(payload, secret);
    token = issueToken({ id: user._id }, KEY);
    await Users.updateToken(user._id, token);
  });

  afterAll(async () => {
    const mongo = await db;
    await User.deleteOne({ email: newUser.email });
    await mongo.disconnect();
  });

  beforeEach(async () => {
    await Contact.deleteMany({});
  });

  describe('Get request', () => {
    test('should return status OK get all contacts', async () => {
      const response = await request(app)
        .get('/api/contacts')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contacts).toBeInstanceOf(Array);
    });

    test('should return status OK get contact by id', async () => {
      const contact = await Contact.create({ ...newContact, owner: user._id });
      const response = await request(app)
        .get(`/api/contacts/${contact._id}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(HttpCode.OK);
      expect(response.body).toBeDefined();
      expect(response.body.data.contact).toHaveProperty('id');
      expect(response.body.data.contact.id).toBe(String(contact._id));
    });
      test('should return status OK get contact without id', async () => {
        const fakeId = '60d58b60f101a53b80bc7b92'
        const response = await request(app)
        .get(`/api/contacts/${fakeId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(HttpCode.NOT_FOUND);
      expect(response.body).toBeDefined();
      })
    
  });
    
    describe('Post request', () => {
         test('should return status 201 create contact', async () => {
      const response = await request(app)
        .post('/api/contacts')
        .set('Authorization', `Bearer ${token}`)
        .send(newContact)
        .set('Accept', 'application/json')
        
      expect(response.status).toEqual(HttpCode.CREATED);
      expect(response.body).toBeDefined();
        });
    })
 })