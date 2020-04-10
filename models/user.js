 const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  password: String,
  email: String,
  confirmationCode: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
