'use strict';

const AWS = require('aws-sdk');

const getClient = () => {
  return new AWS.DynamoDB.DocumentClient({
    region: 'eu-west-2',
  });
};

module.exports = getClient();
