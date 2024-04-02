const request = require('supertest');
const app = require('../app');
const { closeDB } = require('../database');
const utils = require('./utils/testUtils');
const validUserObjectId = process.env.TEST_USER_OBJECT_ID;

const Entry = require('../models/Entry');

// mock the Save function but keep the rest of the model's behavior intact
jest.mock('../models/Entry', () => {
  const actualEntry = jest.requireActual('../models/Entry'); // Get the real module

  // Mock only the save method on the model's prototype
  actualEntry.prototype.save = jest.fn().mockImplementation(function () {
    return Promise.resolve(this);
  });

  return actualEntry;
});

describe('Manage entries', () => {
  let testingToken;

  beforeAll(async () => {
    testingToken = utils.generateTestingToken(
      validUserObjectId,
      'test123@testest.com'
    );
  });

  afterAll(async () => {
    // await closeDB();
    await jest.clearAllMocks();
  });

  it('should create a new entry', async () => {
    const mockEntryData = {
      audit: '643c5660816e4e863bf2c02a',
      location: '123 N South St, KCMO 64161',
      coordinates: [123, 789],
      text: 'This intersection is ok.',
      pictures: ['/a/url'],
      ratings: {
        treeCover: 0,
        adaCompliance: 1,
        noise: null,
      },
    };

    const res = await request(app)
      .post('/api/entries/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send(mockEntryData);

    expect(Entry).toHaveBeenCalled();
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('data');
    expect(res.body.message).toBe('Entry created');
  });

  it('should not create a new entry without location', async () => {
    await request(app)
      .post('/api/entries/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        audit: '643c5660816e4e863bf2c02a',
        text: 'This is a test entry',
        coordinates: [123, 890],
        pictures: [],
        treeCoverRating: 5,
        adaComplianceRating: 5,
        noiseRating: 5,
        litterRating: 5,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toContain('Entry validation failed');
      });
  });

  it('should not create a new entry without coordinates', async () => {
    await request(app)
      .post('/api/entries/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        text: 'This is a test entry',
        pictures: [],
        coordinates: null,
        treeCoverRating: 5,
        adaComplianceRating: 5,
        noiseRating: 5,
        litterRating: 5,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toContain('Entry validation failed');
      });
  });

  it('should not create a new entry without an audit ID', async () => {
    await request(app)
      .post('/api/entries/create')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        location: '123 Main St, New York, NY 10001',
        text: 'This is a test entry',
        pictures: [],
        treeCoverRating: 5,
        adaComplianceRating: 5,
        noiseRating: 5,
        litterRating: 5,
      })
      .expect(400)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toContain('Entry validation failed');
      });
  });

  it('should get all entries', async () => {
    await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${testingToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeTruthy();
        expect(res.body.message).toBe('Entries retrieved');
      })
      .expect((res) => {
        expect(res.body.data.length).toBeGreaterThan(0);
      });
  });

  it('should get all entries for the currently logged in user', async () => {
    await request(app)
      .get('/api/entries')
      .set('Authorization', `Bearer ${testingToken}`)
      .expect((res) => {
        res.body.data.forEach((entry) => {
          expect(entry.user).toBe(validUserObjectId);
        });
      });
  });

  it('should get a single entry by id', async () => {
    const entry = await Entry.findOne({ user: validUserObjectId });
    await request(app)
      .get(`/api/entries/${entry._id}`)
      .set('Authorization', `Bearer ${testingToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeTruthy();
        expect(res.body.message).toBe('Entry retrieved');
      })
      .expect((res) => {
        expect(res.body.data._id).toBe(entry._id.toString());
      });
  });

  it('should not get a single entry by id if the entry does not exist', async () => {
    await request(app)
      .get('/api/entries/123')
      .set('Authorization', `Bearer ${testingToken}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toBe('Entry not found');
      });
  });

  // todo: stopped here; need to figure out why the entry_id is invalid - maybe getting old and now invalid entries?
  // todo: delete created entries after each test (and fix that in the delete test)
  // todo: clear out database
  it('should update an entry by id', async () => {
    const entry = await Entry.findOne({ user: validUserObjectId });
    console.log('this is the entry: ' + entry);
    await request(app)
      .put(`/api/entries/${entry._id}`)
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        noiseRating: 5,
        litterRating: 3,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data).toBeTruthy();
        expect(res.body.message).toBe('Entry updated');
      })
      .expect((res) => {
        expect(res.body.data._id).toBe(entry._id.toString());
      });
  });

  it('should not update an entry by id if the entry does not exist', async () => {
    await request(app)
      .put('/api/entries/123')
      .set('Authorization', `Bearer ${testingToken}`)
      .send({
        location: '123 Main St, New York, NY 64116',
        litterRating: 1,
      })
      .expect(404)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toBe('Entry not found');
      });
  });

  it('should delete an entry by id', async () => {
    const entry = await Entry.findOne({ user: validUserObjectId });
    await request(app)
      .delete(`/api/entries/${entry._id}`)
      .set('Authorization', `Bearer ${testingToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.message).toBe('Entry deleted');
      })
      .expect((res) => {
        expect(res.body.data._id).toBe(entry._id.toString());
      });
  });

  it('should not delete an entry by id if the entry does not exist', async () => {
    await request(app)
      .delete('/api/entries/123')
      .set('Authorization', `Bearer ${testingToken}`)
      .expect(404)
      .expect((res) => {
        expect(res.body.data).toBeFalsy();
        expect(res.body.message).toBe('Entry not found');
      });
  });
});
