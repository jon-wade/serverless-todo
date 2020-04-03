'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const dynamoDb = require('../../config/db');
const deleteItem = require('../../functions/delete.js');

afterEach(() => {
  sinon.restore();
});

describe('todo-server delete function unit test', function () {
  it('should check a successful delete call', async done => {
    const event = { body: { id: 'abcd' } };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);

      const body = JSON.parse(res.body);
      expect(body).to.be.an('object');
      expect(body.id).to.equal('abcd');
      done();
    };
    const stub = sinon.stub(dynamoDb, 'delete').callsFake((params, cb) => {
      cb();
    });
    await deleteItem(event, null, cb);
  });

  it('should check a failed delete call', async done => {
    const event = { body: { id: 'abcd' } };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(501);
      expect(res.body).to.be.an('string');
      expect(res.body).to.equal(`Couldn\'t delete the todo item.`);
      done();
    };
    const stub = sinon.stub(dynamoDb, 'delete').callsFake((params, cb) => {
      cb(new Error('Test error'));
    });
    await deleteItem(event, null, cb);
  });
});
