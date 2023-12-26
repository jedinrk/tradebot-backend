const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TradeSchema = new Schema({
  id: {
    type: Number,
    required: true,
  }
});

const User = mongoose.model("trade", TradeSchema);
module.exports = User;
