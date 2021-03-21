const express = require('express');

const router = express.Router();
const optifine = require('../utils/optifine');

router.get('/user/cape/:username', async (req, res) => {
  const data = await optifine.OptifineCape(req.params.username);
  res.status(200).send(data);
});

router.get('/user/croppedcape/:username', async (req, res) => {
  optifine.CroppedOptifineCape(req.params.username, parseInt(req.query.scale, 10) || 1)
    .then((img) => {
      res.set({ 'Content-Type': 'image/png' }).status(200).send(img);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
});

module.exports = router;
