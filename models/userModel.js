const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");

const UserSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  joinDate: { type: Date, default: Date.now },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isSuspended: { type: Boolean, default: false },
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  return `/user/${this._id}`;
});

UserSchema.virtual("joinDate_formatted").get(function () {
  return DateTime.fromJSDate(this.joinDate).toLocaleString({
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
});

module.exports = mongoose.model("User", UserSchema);
