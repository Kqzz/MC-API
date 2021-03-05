const express = require('express');

const router = express.Router();
const namemc = require('../utils/namemc');

router.get('/user/:identifier', async (req, res) => {
  try {
    res.status(200).send(await namemc.userStats(req.params.identifier));
  }
  catch (err) {
    res.status(err.status).send(err);
  }
});

router.get('/droptime/:username', async (req, res) => {
  let data = {};
  try {
    data = await namemc.droptime(req.params.username);
  }
  catch (err) {
    res.status(err.status).send(err);
    return;
  }

  let resp_status = 200;
  if (data.error !== undefined) {
    resp_status = 400;
  }

  res.status(resp_status).send(data);
});

router.get('/upcoming', async (req, res) => {
  let data = {};

  const searches = req.query.searches || '';
  const op = req.query.op || '';
  const lang = req.query.lang || '';
  const length = req.query.length || '';

  try {
    data = await namemc.upcoming(op, length, lang, searches);
  }
  catch (err) {
    console.log(err);
    res.status(err.status).send(err);
  }
  res.send(data);
});

module.exports = router;
