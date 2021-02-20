const express = require('express');

const mojangAPI = require('./routes/mojangApi');
const namemcAPI = require('./routes/namemcApi');

const app = express();

app.set('json spaces', 0);
app.use('/api/mojang', mojangAPI); // mojang API routes
app.use('/api/namemc', namemcAPI); // Namemc API routes

module.exports = app;
