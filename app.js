"use strict";

const express = require("express");
const path = require("path");

const mojangAPI = require("./routes/mojangApi");
const namemcAPI = require("./routes/namemcApi");

const app = express();

app.set("json spaces", 0);
app.use("/api/mojang", mojangAPI); // mojang api
app.use("/api/namemc", namemcAPI);

module.exports = app