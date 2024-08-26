// models/Log.js
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  time: String,
  url: String,
  // headers: Object,
  // method: String,
});

const Log = mongoose.models.Log || mongoose.model("Log", LogSchema);

module.exports = Log;
