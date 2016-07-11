/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Apartment = require('../../dst/models/apartment');

describe('Apartments', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      cp.execFile(`${__dirname}/../scripts/populate-rent.sh`, { cwd: `${__dirname}/../scripts` }, () => {
        done();
      });
    });
  });

  describe('post /apartments', () => {
    it('should create a apartment', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqft: 900, bedrooms: 1, floor: 4, rent: 1000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.__v).to.not.be.null;
        expect(rsp.body.apartment._id).to.not.be.null;
        expect(rsp.body.apartment.name).to.equal('a4');
        done();
      });
    });

    it('should NOT create a apartment - missing name', (done) => {
      request(app)
      .post('/apartments')
      .send({ sqft: 900, bedrooms: 1, floor: 4, rent: 1000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });

    it('should NOT create a apartment - rent is malformed', (done) => {
      request(app)
      .post('/apartments')
      .send({ name: 'a4', sqft: 900, bedrooms: 1, floor: 4, rent: 'duck' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"rent" must be a number']);
        done();
      });
    });
  });

  describe('put /apartments/:id', () => {
    it('should update a apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890013')
      .send({ name: 'a6', sqft: 1100, collectedRent: 1200, rent: 2300, bedrooms: 3, floor: 3 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.sqft).to.equal(1100);
        expect(rsp.body.apartment.collectedRent).to.equal(1200);
        done();
      });
    });
  });
  //
  describe('get /apartments', () => {
    it('should get all the apartments', (done) => {
      request(app)
      .get('/apartments')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(3);
        done();
      });
    });

    it('should filter apartments by name, and squarefootage', (done) => {
      request(app)
      .get('/apartments?filter[name]=a1&filter[sqft]=1200')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(1);
        expect(rsp.body.apartments[0].floor).to.equal(3);
        done();
      });
    });
    it.skip('should filter apartments by squarefootage more than 1100', (done) => {
      request(app)
      .get('/apartments?filter[sqft]={$gt:1100}')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartments).to.have.length(2);
        expect(rsp.body.apartments[0].floor).to.equal(3);
        done();
      });
    });
  });

  describe('get /apartments/:id', () => {
    it('should get one apartment', (done) => {
      request(app)
      .get('/apartments/012345678901234567890013')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment._id).to.equal('012345678901234567890013');
        done();
      });
    });
  });

  describe('delete /apartments/:id', () => {
    it('should delete a apartment', (done) => {
      request(app)
      .delete('/apartments/012345678901234567890013')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('012345678901234567890013');
        done();
      });
    });
    it('should NOT delete a apartment - does not exist', (done) => {
      request(app)
      .delete('/apartments/01234567890123456789abcd')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });

    it('should NOT delete a apartment - bad id', (done) => {
      request(app)
      .delete('/apartments/wrong')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "wrong" fails to match the required pattern');
        done();
      });
    });
  });

  describe('put /apartments/:id/lease', () => {
    it('should update a apartment', (done) => {
      request(app)
      .put('/apartments/012345678901234567890013/lease')
      .send({ name: 'a3', sqft: 1100, collectedRent: 1200, rent: 2300, bedrooms: 3, floor: 3, renter: '012345678901234567890913' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.apartment.renter.money).to.equal(60000);
        expect(rsp.body.renter.apartment.name).to.equal('a3');
        done();
      });
    });
  });
});
