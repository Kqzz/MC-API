const express = require("express");
const router = express.Router();
const namemc = require("./namemc");

router.get("/user/:identifier", async (req, res) => {
    data = await namemc.userStats(req.params.identifier);
    console.log(data)

    res.send(data)
});

router.get("/droptime/:username", async (req, res) => {
    data = await namemc.droptime(req.params.username);
    res.status(200).send(data)
})

module.exports = router;
