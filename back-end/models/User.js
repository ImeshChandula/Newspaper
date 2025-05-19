const mongoose = require("mongoose");
const ROLES = require("../config/roles");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true},
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.EDITOR, 
  },
});

module.exports = mongoose.model("User", UserSchema);
