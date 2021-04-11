const express = require('express');

const router = express.Router();
const optifine = require('../utils/optifine');

router.get('/cape/:username', async (req, res) => {
  const data = await optifine.OptifineCape(req.params.username);
  res.status(200).send(data);
});

// router.get('/croppedcape/:username', async (req, res) => {
//   optifine.CroppedOptifineCape(req.params.username, Number(req.query.scale) || 1)
//     .then((img) => {
//       console.log(Buffer.from(img));
//       res.set({ 'Content-Type': 'image/png' }).status(200).send(Buffer.from(img));
//     })
//     .catch((err) => {
//       res.status(500).send(err);
//     });
// });

module.exports = router;
