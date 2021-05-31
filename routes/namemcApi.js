const express = require('express');

const router = express.Router();
const namemc = require('../utils/namemc');

router.get('/user/:identifier', async (req, res) => {
  try {
    res.send(await namemc.userStats(req.params.identifier));
  }
  catch (err) {
	console.log(err)
    res.status(err.status).send(err);
  }
});

router.get('/droptime/:username', async (req, res) => {
  try {
    const data = await namemc.droptime(req.params.username);

    let resp_status = 200;
    if (data.error !== undefined) {
      resp_status = 400;
    }

    res.status(resp_status).send(data);
  }
  catch (err) {
    res.status(err.status).send(err);
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const {
      searches,
      op,
      lang,
      length
    } = req.query;

    // const searches = req.query.searches || ''
    // const op = req.query.op || ''
    // const lang = req.query.lang || ''
    // const length = req.query.length || ''

    const data = await namemc.upcoming(op, length, lang, searches);

    res.send(data);
  }
  catch (err) {
    console.log(err);
    res.status(err.status).send(err);
  }
});

router.get('/searches/:username', async (req, res) => {
  const data = {};
  data.username = req.params.username;
  data.searches = await namemc.searches(req.params.username);
  res.send(data);
});

module.exports = router;
