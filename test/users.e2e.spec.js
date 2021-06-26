const request = require('supertest');
const jwt = require('jsonwebtoken');
const fs = require('fs/promises')
require('dotenv').config();
const app = require('../app');
const db = require('../model/db');
const User = require('../model/user');
const Users = require('../repositories/users');
const { newTestUser } = require('./data/data');
const { HttpCode } = require('../helpers/constants')

jest.mock('cloudinary')

describe('Test route users', () => {
    let token
    
    beforeAll(async () => {
        await db;
        await User.deleteOne({ email: newTestUser.email });
    });
    
    afterAll(async () => {
        const mongo = await db;
        await User.deleteOne({ email: newTestUser.email });
        await mongo.disconnect();
    });
    
    test('Register User', async () => {
        const response = await request(app)
        .post('/api/users/register')
        .send(newTestUser)
        .set('Accept', 'application/json')
        
        expect(response.status).toEqual(HttpCode.CREATED);
        expect(response.body).toBeDefined();
        
    })
    test('Create 409 User', async () => {
        const response = await request(app)
        .post('/api/users/register')
        .send(newTestUser)
        .set('Accept', 'application/json')
        
        expect(response.status).toEqual(HttpCode.CONFLICT);
        expect(response.body).toBeDefined();
    })
    test('Login user', async () => {
        const response = await request(app)
      .post(`/api/users/login`)
      .send(newTestUser)
      .set('Accept', 'application/json');
        expect(response.status).toEqual(HttpCode.OK);
        expect(response.body).toBeDefined();
        token = response.body.data.token;
  });
    test('Wrong Login User', async () => { })
    test('Upload avatar User', async () => {
        const buf = await fs.readFile('./test/data/avatar.jpg')
        const response = await request(app)
            .patch('/api/users/avatars')
            .set('Authorization', `Bearer ${token}`)
            .attach('avatar', buf, 'avatar.jpg');
        expect(response.status).toEqual(HttpCode.OK);
        expect(response.body).toBeDefined();
        expect(response.body.data.avatarURL).toEqual('secure_url');
    })
})