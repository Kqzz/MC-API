"use strict";

const express = require("express");
const path = require("path");

const mojangAPI = require("./routes/mojangApi");
const namemcAPI = require("./routes/namemcApi");

const app = express();
const port = 3000;

app.set("json spaces", 0);
app.use("/api/mojang", mojangAPI); // mojang api
app.use("/api/namemc", namemcAPI);

// app.use("/", express.static(__dirname + "/views")); // home

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
