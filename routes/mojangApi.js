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
    res.status(err.code).send(err);
  }

  if (data.uuid === undefined) {
    res.status(404).send({ error: 'no user with that username', code: 404 });
    return;
  }

  data.username_history = await mojang.nameHistory(data.uuid);

  try {
    data.textures = await mojang.profile(data.uuid); // This needs to replace that previous endpoint in the future
  }
  catch (e) {
    res.status(e.code).send(e);
  }

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
