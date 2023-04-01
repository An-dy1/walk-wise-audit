const request = require('supertest');
const app = require('../app');
const { closeDB } = require('../database');
const Entry = require('../models/Entry');
const utils = require('./utils/testUtils');
const validObjectId = process.env.TEST_USER_OBJECT_ID;

describe('Manage entries', () => {
  let testingToken;

  beforeAll(async () => {
    testingToken = utils.generateTestingToken(
      validObjectId,
      'test123@testest.com'
    );
    console.log(testingToken);
  });

  afterAll(async () => {
    await closeDB();
  });

  it('should create a new entry', async () => {
    await request(app)
      .post('/api/entries/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        location: 'Point',
        text: 'This is a test entry',
        pictures: [],
        treeCoverRating: 5,
        adaComplianceRating: 5,
        noiseRating: 5,
        litterRating: 5,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeTruthy();
        expect(res.body.status).toBe('success');
        expect(res.body.message).toBe('Entry created');
      });
  });
});
