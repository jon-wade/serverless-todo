'use strict';

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const dynamoDb = require('../../src/config/db');
const updateItem = require('../../src/functions/update.js');

afterEach(() => {
  sinon.restore();
});

describe('todo-server update function unit test', function () {
  it('should check a successful update call', async done => {
    const event = {
      body:
        { id: 'abcd',
          text: 'test',
          checked: true
        }
    };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(200);

      const body = JSON.parse(res.body);
      expect(body).to.be.an('object');
      expect(body.id).to.equal('abcd');
      done();
    }

    const stub = sinon.stub(dynamoDb, 'update').callsFake((params, cb) => {
      cb();
    });
    await updateItem(event, null, cb);
  })

  it('should check a failed update call', async done => {
    const event = {
      body:
        { id: 'abcd',
          text: 'test',
          checked: true
        }
    };
    const cb = (err, res) => {
      expect(err).to.be.null;
      expect(stub.callCount).to.equal(1);
      expect(res).to.be.an('object');
      expect(res.statusCode).to.equal(501);
      expect(res.body).to.be.an('string');
      expect(res.body).to.equal(`Couldn\'t update the todo item.`);
      done();
    };
    const stub = sinon.stub(dynamoDb, 'update').callsFake((params, cb) => {
      cb(new Error('Test error'));
    });
    await updateItem(event, null, cb);
  });
})
