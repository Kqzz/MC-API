const express = require('express');

const mojangAPI = require('./routes/mojangApi');
const namemcAPI = require('./routes/namemcApi');
const optifineAPI = require('./routes/optifineApi');

const app = express();

app.set('json spaces', 0);
app.use('/api/mojang', mojangAPI); // mojang API routes
app.use('/api/namemc', namemcAPI); // Namemc API routes
app.use('/api/optifine', optifineAPI);

app.get('/', (req, res) => {
  res.redirect('https://kqzz.github.io/MC-API/#/');
});

app.get('/*', (req, res) => {
  res.status(404).send({ error: 'page not found', status: 404 });
});

module.exports = app;
