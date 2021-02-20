const express = require('express');

const router = express.Router();
const mojang = require('../utils/mojang');
const namemc = require('../utils/namemc');
const { OptifineCape } = require('../utils/optifine');

router.get('/user/:username', async (req, res) => {
  const data = {};

  // if (req.params.username.length <= 16) {
  //   const username_data = await mojang.usernameToUUID(req.params.username);
  //   data.uuid = username_data.uuid
  //   data.username = username_data.username
  //   data.legacy = username_data.legacy
  //   data.demo = username_data.demo
  // } else {
  //   const username_data = await mojang.usernameToUUID(req.params.username);
  //   data.uuid = username_data.uuid
  //   data.username = username_data.username
  //   data.legacy = username_data.legacy
  //   data.demo = username_data.demo
  // }

  const use_namemc = req.query.namemc || false;
  const use_optifine = req.query.optifine || false;

  const username_data = await mojang.usernameToUUID(req.params.username);
  data.uuid = username_data.uuid;
  data.username = username_data.username;
  data.legacy = username_data.legacy;
  data.demo = username_data.demo;

  if (data.uuid === undefined) {
    res.status(404).send({ error: 'no user with that username' });
    return;
  }

  data.username_history = await mojang.nameHistory(data.uuid);
  data.textures = await mojang.textures(data.uuid);

  // data.created_at = await mojang.created(data.uuid, data.username) // Removed because mojang removed the api endpoint 😢

  if (use_optifine) {
    data.optifine = await OptifineCape(data.username);
  }

  if (use_namemc) {
    console.log('namemc was true!');
    data.namemc = await namemc.userStats(req.params.username);
  }

  res.status(200).send(data);
});

module.exports = router;
