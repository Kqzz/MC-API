const express = require('express');

const router = express.Router();
const mojang = require('../utils/mojang');
const namemc = require('../utils/namemc');
const { OptifineCape } = require('../utils/optifine');

router.get('/user/:username', async (req, res) => {
  let data = {};

  const use_namemc = req.query.namemc || false;
  const use_optifine = req.query.optifine || false;

  try {
    const returned_data = await mojang.usernameToUUID(req.params.username);
    data = Object.assign(data, returned_data);
  }
  catch (err) {
    res.status(err.status).send(err);
    return;
  }

  if (data.uuid === undefined) {
    res.status(404).send({ error: 'no user with that username', status: 404 });
    return;
  }

  try {
    data.username_history = await mojang.nameHistory(data.uuid);
  }
  catch (err) {
    res.status(err.status).send(err);
    return;
  }

  try {
    data.textures = await mojang.profile(data.uuid); // This needs to replace that previous endpoint in the future
  }
  catch (err) {
    res.status(err.status).send(err);
    return;
  }

  if (use_optifine) {
    await OptifineCape(data.username)
      .then((returned_data) => {
        data.optifine = returned_data;
      });
  }

  if (use_namemc) {
    try {
      data.namemc = await namemc.userStats(req.params.username);
    }
    catch (err) {
      res.status(err.status).send(err);
    }
  }

  res.status(200).send(data);
});

module.exports = router;
