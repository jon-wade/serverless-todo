'use strict';

const uuid = require('uuid');
const dynamoDb = require('../config/db');
const debug = require('debug');
const log = debug('create');

const createItem = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = event.body;
  if (typeof data.text !== 'string') {
    log('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t create the todo item.',
    });
    return;
  }

  const params = {
    TableName: 'itemsTable',
    Item: {
      id: uuid.v1(),
      text: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

  // write the item to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the todo item.',
      });
      return;
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };

    callback(null, response);
  });
};

module.exports = createItem;
