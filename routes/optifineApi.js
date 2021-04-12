const express = require("express");

const router = express.Router();
const optifine = require("../utils/optifine");

router.get("/cape/:username", async (req, res) => {
  try {
    const data = await optifine.OptifineCape(req.params.username);
    res.status(200).send(data);
  } catch (err) {
    if (err) {
      res.status(err.status).send(err);
    }
  }
});

module.exports = router;
