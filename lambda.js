const serverless = require('serverless-http');
const server = require('./app');

const handler = serverless(server);
module.exports.server = async (event, context) => await handler(event, context);
