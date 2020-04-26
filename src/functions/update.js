'use strict';

const dynamoDb = require('../config/db');
const debug = require('debug');
const log = debug('update');

const updateItem = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = event.body;
  if (typeof data.id !== 'string') {
    log('Validation Failed');
    callback(null, {
      statusCode: 400,
      headers: { 'Content-Type': 'text/plain' },
      body: 'Couldn\'t update the todo item.',
    });
    return;
  }

  let params = {
    TableName: 'itemsTable',
    Key: {
      id: data.id,
    },
    AttributeUpdates: {}
  };

  if (data.text) {
    params.AttributeUpdates.text = {
      Action: 'PUT',
      Value: data.text,
    }
  }

  if (data.checked) {
    params.AttributeUpdates.checked = {
      Action: 'PUT',
      Value: data.checked,
    }
  }

  params.AttributeUpdates.updatedAt = {
    Action: 'PUT',
    Value: timestamp,
  };

  dynamoDb.update(params, (error) => {
    // handle potential errors
    if (error) {
      log(error);
      callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the todo item.',
      });
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Key),
    }

    callback(null, response);
  });
};

module.exports = updateItem;


