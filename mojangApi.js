const express = require("express");
const router = express.Router();
const mojang = require("./mojang");
const namemc = require("./namemc");

router.get("/user/:username", async (req, res) => {
  let data = {};

  let use_namemc = req.query.namemc;
  if (use_namemc === undefined) {
    use_namemc = false;
  }

  const username_data = await mojang.usernameToUUID(req.params.username);
  data.UUID = username_data[0];
  data.username = username_data[1];

  if (data.UUID === undefined) {
    res.status(404).send({ error: "no user with that username" });
    return;
  }

  data.nameHistory = await mojang.nameHistory(data.UUID);
  data.textures = await mojang.textures(data.UUID);

  // data.created_at = await mojang.created(data.UUID, data.username) // Removed because mojang removed the api endpoint 😢

  if (use_namemc) {
    console.log("namemc was true!");
    data.namemc = await namemc.userStats(req.params.username)
  }

  res.status(200).send(data);
});

router.get("/", (req, res) => {
  res.send("Hey");
});

module.exports = router;
