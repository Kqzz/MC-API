const express = require('express');

const router = express.Router();
const optifine = require('../utils/optifine');

router.get('/user/cape/:username', async (req, res) => {
  const data = await optifine.OptifineCape(req.params.username);
  res.status(200).send(data);
});

module.exports = router;
