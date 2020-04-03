'use strict';

const uuid = require('uuid');
const dynamoDb = require('../config/db');
const debug = require('debug');
const log = debug('delete');

const deleteItem = (event, context, callback) => {
  const data = event.body;
  if (typeof data.id !== 'string') {
    log('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t delete the todo item.',
    });
    return;
  }

  const params = {
    TableName: 'itemsTable',
    Key: {
      id: data.id,
    },
  };

  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t delete the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Key),
    };
    callback(null, response);
  });
};

module.exports = deleteItem;
