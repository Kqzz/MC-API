const express = require("express");

const router = express.Router();
const mojang = require("../utils/mojang");
const namemc = require("../utils/namemc");
const { OptifineCape } = require("../utils/optifine");

router.get("/user/:username", async (req, res) => {
  try {
    let data = {};

    const use_namemc = req.query.namemc || false;
    const use_optifine = req.query.optifine || false;

    const returned_data = await mojang.usernameToUUID(req.params.username);
    data = Object.assign(data, returned_data);

    if (data.uuid === undefined) {
      res
        .status(404)
        .send({ error: "no user with that username", status: 404 });
      return;
    }

    data.username_history = await mojang.nameHistory(data.uuid);
    data.textures = await mojang.profile(data.uuid); // This needs to replace that previous
    // endpoint in the future

    if (use_optifine) {
      data.optifine = await OptifineCape(data.username);
    }

    if (use_namemc) {
      data.namemc = await namemc.userStats(req.params.username);
    }

    res.send(data);
  } catch (err) {
    if (err) {
      res.status(err.status).send(err);
    }
  }
});

module.exports = router;
