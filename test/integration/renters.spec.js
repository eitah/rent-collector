/* eslint-disable no-unused-expressions, no-underscore-dangle, max-len */

const expect = require('chai').expect;
const request = require('supertest');
const app = require('../../dst/server');
const cp = require('child_process');
// const Renter = require('../../dst/models/renter');

describe('Renters', () => {
  beforeEach((done) => {
    cp.execFile(`${__dirname}/../scripts/populate.sh`, { cwd: `${__dirname}/../scripts` }, () => {
      cp.execFile(`${__dirname}/../scripts/populate-rent.sh`, { cwd: `${__dirname}/../scripts` }, () => {
        done();
      });
    });
  });

  describe('post /renters', () => {
    it('should create a renter', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'guy', money: 3300 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.__v).to.not.be.null;
        expect(rsp.body.renter._id).to.not.be.null;
        expect(rsp.body.renter.name).to.equal('guy');
        done();
      });
    });

    it('should NOT create a renter - missing name', (done) => {
      request(app)
      .post('/renters')
      .send({ money: 3300 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"name" is required']);
        done();
      });
    });

    it('should NOT create a renter - money is malformed', (done) => {
      request(app)
      .post('/renters')
      .send({ name: 'guy', money: 'ducks' })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages).to.deep.equal(['"money" must be a number']);
        done();
      });
    });
  });

  describe('put /renters/:id', () => {
    it('should update a renter', (done) => {
      request(app)
      .put('/renters/012345678901234567890913')
      .send({ name: 'guy', money: 9300 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.money).to.equal(9300);
        done();
      });
    });
  });
  //
  describe('get /renters', () => {
    it('should get all the renters', (done) => {
      request(app)
      .get('/renters')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(4);
        done();
      });
    });

    it('should filter renters by name, and squarefootage', (done) => {
      request(app)
      .get('/renters?filter[name]=Jennifer%20Stamen&filter[money]=60000')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(1);
        expect(rsp.body.renters[0]._id).to.equal('012345678901234567890913');
        done();
      });
    });
    it.skip('should filter renters by squarefootage more than 1100', (done) => {
      request(app)
      .get('/renters?filter[sqft]=1100{$gt:1100}')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renters).to.have.length(2);
        expect(rsp.body.renters[0].floor).to.equal(3);
        done();
      });
    });
  });

  describe('get /renters/:id', () => {
    it('should get one renter', (done) => {
      request(app)
      .get('/renters/012345678901234567890913')
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter._id).to.equal('012345678901234567890913');
        done();
      });
    });
  });

  describe('delete /renters/:id', () => {
    it('should delete a renter', (done) => {
      request(app)
      .delete('/renters/012345678901234567890913')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.id).to.equal('012345678901234567890913');
        done();
      });
    });
    it('should NOT delete a renter - does not exist', (done) => {
      request(app)
      .delete('/renters/01234567890123456789abcd')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.equal('id not found');
        done();
      });
    });

    it('should NOT delete a renter - bad id', (done) => {
      request(app)
      .delete('/renters/wrong')
      .end((err2, rsp) => {
        expect(err2).to.be.null;
        expect(rsp.status).to.equal(400);
        expect(rsp.body.messages[0]).to.contain('"id" with value "wrong" fails to match the required pattern');
        done();
      });
    });
  });

  describe('put /renters/:id/pay', () => {
    it('should update a renter', (done) => {
      request(app)
      .put('/renters/012345678901234567890914/pay')
      .send({ name: 'Rick Hasanapartment', money: 20000 })
      .end((err, rsp) => {
        expect(err).to.be.null;
        expect(rsp.status).to.equal(200);
        expect(rsp.body.renter.money).to.equal(17500);
        expect(rsp.body.apartment.collectedRent).to.equal(2500);
        done();
      });
    });
  });
});
