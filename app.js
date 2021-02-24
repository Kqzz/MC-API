const express = require('express');

const mojangAPI = require('./routes/mojangApi');
const namemcAPI = require('./routes/namemcApi');

const app = express();

app.set('json spaces', 0);
app.use('/api/mojang', mojangAPI); // mojang API routes
app.use('/api/namemc', namemcAPI); // Namemc API routes

app.get('/', (req, res) => {
  res.redirect('https://kqzz.github.io/MC-API/#/');
});

module.exports = app;
