const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    Required: true
  },
  email: {
    type: String,
    Required: true,
    unique: true
  },
  password: {
    type: String,
    Required: true
  },
  user_type: {
    type: String,
    Required: true
  },
  secure_phase: {
    type: String,
    default: "",
    Required: true
  },
  image: {
    type: String,
    Required: true
  },
  reset_password: {
    type: String,
    Required: true
  },
  confirm_password: {
    type: String,
    Required: true
  },
});
module.exports = mongoose.model('admin', UserSchema);