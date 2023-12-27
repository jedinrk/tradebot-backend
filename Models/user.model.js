const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  user_type: String,
  email: {
    type: String,
    index: true,
    unique: true,
  },
  user_name: String,
  user_shortname: String,
  broker: String,
  exchanges: [String],
  products: [String],
  order_types: [String],
  avatar_url: String,
  user_id: {
    type: String,
    index: true,
    unique: true,
  },
  api_key: String,
  access_token: String,
  public_token: String,
  refresh_token: String,
  enctoken: String,
  login_time: Date,
  meta: {
    demat_consent: String,
  },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
