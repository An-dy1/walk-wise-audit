const request = require('supertest');
const app = require('../app');
const { closeDB } = require('../database');
const Entry = require('../models/Entry');
const utils = require('./utils/testUtils');
const validUserObjectId = process.env.TEST_USER_OBJECT_ID;

describe('Manage audits', () => {
  let testingToken;

  let testEntryId = '6430cd3c2e91ac2938edce99';
  beforeAll(async () => {
    testingToken = utils.generateTestingToken(
      validUserObjectId,
      'test123@testest.com'
    );
  });

  afterAll(async () => {
    await closeDB();
  });

  it('should create a new audit', async () => {
    await request(app)
      .post('/api/audits/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        entries: [testEntryId],
        summary: 'This is a test audit',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeTruthy();
        expect(res.body.message).toBe('Audit created');
      });
  });
});
