'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const dynamoDb = require('../../config/db');
const createItem = require('../../functions/create.js');
const deleteItem = require('../../functions/delete.js');

afterEach(() => {
  sinon.restore();
});

describe('todo-server create function unit test', function () {
  it('should check a successful create call', async done => {
    const event = { body: { text: 'event' } };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);
      expect(res.body).to.be.an('string');

      const body = JSON.parse(res.body);
      expect(body).to.be.an('object');
      expect(body.text).to.equal('event');
      expect(body.checked).to.be.false;
      done();
    };
    const stub = sinon.stub(dynamoDb, 'put').callsFake((params, cb) => {
      cb();
    });
    await createItem(event, null, cb);
  });

  it('should check a failed create call', async done => {
    const event = { body: { text: 'event' } };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(501);
      expect(res.body).to.be.an('string');
      expect(res.body).to.equal(`Couldn\'t create the todo item.`);
      done();
    };
    const stub = sinon.stub(dynamoDb, 'put').callsFake((params, cb) => {
      cb(new Error('Test error'));
    });
    await createItem(event, null, cb);
  });
});
