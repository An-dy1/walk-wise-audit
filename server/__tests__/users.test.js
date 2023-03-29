// import * as request from 'supertest';
// import app from '../app';
// import { closeDB } from '../database';
// import User from '../models/User';
const request = require('supertest');
const app = require('../app');
const closeDB = require('../database').closeDB;
const User = require('../models/User').default;
// import { closeDB } from '../database';
// import User from '../models/User';

describe('User Registration and Login', () => {
  let validTestEmail = 'testuser@test.com';
  let validTestPw = 'testpassword123';

  let invalidTestEmail = 'andie';
  let invalidTestPw = '123';

  afterAll(async () => {
    // Delete test users from the database after the test suite.
    await User.deleteMany({ email: validTestEmail });
    await closeDB();
  });

  it('should register a new user', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        email: validTestEmail,
        password: validTestPw,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.token).toBeTruthy();
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('User registered');
      });
  });

  // Test for unsuccessful registration due to an existing email
  it('should not register a user with an existing email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        email: validTestEmail,
        password: validTestPw,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.status).toBe('error');
      });
  });

  // Test for unsuccessful registration due to invalid email or password
  it('should not register a user with invalid email', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        email: invalidTestEmail,
        password: validTestPw,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toBeTruthy();
        expect(res.body.status).toBe('error');
      });
  });

  it('should not register a user with invalid password', async () => {
    await request(app)
      .post('/api/users/register')
      .send({
        email: validTestEmail,
        password: invalidTestPw,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.errors).toBeTruthy();
      });
  });

  // Test for successful user login
  it('should log in a user with valid credentials', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: validTestEmail,
        password: validTestPw,
      })
      .expect(200);
  });

  // Test for unsuccessful login due to invalid email or password
  it('should not log in a user with invalid email', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: 'test@testuser.com',
        password: validTestPw,
      })
      .expect(400);
  });

  it('should not log in a user with invalid password', async () => {
    await request(app)
      .post('/api/users/login')
      .send({
        email: validTestEmail,
        password: 'passwordpassword',
      })
      .expect(400);
  });
});
